import { createServer, Model } from 'miragejs';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

function generateRandomStudents(count) {
  const students = [];

  for (let i = 0; i < count; i++) {
    const student = {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthYear: faker.number.int({ min: 1990, max: 2005 }),
      status: faker.helpers.arrayElement(['учится', 'исключен']),
      idnp: faker.string.numeric(13),
    };
    students.push(student);
  }

  return students;
}

export function makeServer() {
  return createServer({
    models: {
      student: Model,
    },

    seeds(server) {
      const randomStudents = generateRandomStudents(10000);
      randomStudents.forEach(student => {
        server.create('student', student);
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/students', (schema, request) => {
        const pageParam = request.queryParams.page;
        const rowsPerPageParam = request.queryParams.rowsPerPage;
        const searchTerm = request.queryParams.searchTerm || '';
        const minDate = request.queryParams.minDate
          ? dayjs(request.queryParams.minDate)
          : null;
        const maxDate = request.queryParams.maxDate
          ? dayjs(request.queryParams.maxDate)
          : null;

        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const rowsPerPage = rowsPerPageParam
          ? parseInt(rowsPerPageParam, 10)
          : 10;

        let filteredStudents = schema.db.students;

        if (searchTerm) {
          filteredStudents = filteredStudents.filter(student => {
            const fullName =
              `${student.firstName} ${student.lastName}`.toLowerCase();
            const idnp = student.idnp;
            return (
              fullName.includes(searchTerm.toLowerCase()) ||
              idnp.includes(searchTerm)
            );
          });
        }

        if (minDate) {
          filteredStudents = filteredStudents.filter(student => {
            const studentDate = dayjs(`${student.birthYear}-01-01`);
            return (
              studentDate.isAfter(minDate) || studentDate.isSame(minDate, 'day')
            );
          });
        }

        if (maxDate) {
          filteredStudents = filteredStudents.filter(student => {
            const studentDate = dayjs(`${student.birthYear}-01-01`);
            return (
              studentDate.isBefore(maxDate) ||
              studentDate.isSame(maxDate, 'day')
            );
          });
        }

        const totalStudents = filteredStudents.length;
        const start = (page - 1) * rowsPerPage;
        const end = page * rowsPerPage;
        const paginatedStudents = filteredStudents.slice(start, end);

        return {
          students: paginatedStudents,
          totalStudents,
        };
      });

      this.post('/students', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.students.insert(attrs);
      });

      this.put('/students/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        return schema.db.students.update(id, newAttrs);
      });

      this.delete('/students/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.students.remove(id);
        return { message: `Student with id ${id} was deleted` };
      });
    },
  });
}
