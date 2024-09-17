import { createServer, Model } from 'miragejs';
import { Student } from '@/src/types';
import { faker } from '@faker-js/faker';
import axios from 'axios';

// Функция для генерации случайных студентов
function generateRandomStudents(count: number): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const student: Student = {
      id: faker.string.uuid(), // Генерируем случайный UUID с помощью faker.string.uuid()
      firstName: faker.person.firstName(), // Случайное имя
      lastName: faker.person.lastName(), // Случайная фамилия
      birthYear: faker.number.int({ min: 1990, max: 2005 }), // Год рождения
      status: faker.helpers.arrayElement(['учится', 'исключен']), // Статус случайный
      idnp: faker.string.numeric(13), // Случайный IDNP из 13 цифр
    };
    students.push(student);
  }

  return students;
}

export function makeServer() {
  return createServer({
    models: {
      student: Model, // Модель студента
    },

    seeds(server) {
      const randomStudents = generateRandomStudents(100);

      randomStudents.forEach(student => {
        server.create('student', student);
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/students', schema => {
        return schema.db.students; // Возвращаем всех студентов
      });

      this.post('/students', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.students.insert(attrs); // Создаем нового студента
      });

      this.put('/students/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        return schema.db.students.update(id, newAttrs); // Обновляем студента
      });

      this.delete('/students/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.students.remove(id); // Удаляем студента
        return { message: `Student with id ${id} was deleted` };
      });
    },
  });
}

export const getStudents = async (): Promise<Student[] | undefined> => {
  try {
    const response = await axios.get<Student[]>('/api/students');

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error);
  }
};

export const updateStudents = async (
  id: string,
  newStatus: string
): Promise<Student | undefined> => {
  try {
    const response = await axios.put<Student>(`/api/students/${id}`, {
      status: newStatus,
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error);
  }
};
