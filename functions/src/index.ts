import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';

import { Response } from './utils.js';

setGlobalOptions({
  maxInstances: 2,
  timeoutSeconds: 180,
});

import {
  TaskCreateSchema,
  TaskDeleteSchema,
  TaskUpdateSchema,
} from './schema.js';

initializeApp();

const TASKS_COLLECTION = 'tasks';

export const addTask = onRequest({ cors: true }, (request, response) => {
  logger.info('Add task', { structuredData: true });
  const task = request.body;

  logger.info('Body', { structuredData: true, body: task });

  try {
    TaskCreateSchema.parse(task);
  } catch (error) {
    logger.error('Error validating task: ', error);
    response.status(400).json(Response(400, 'Error validating task', error));
    return;
  }

  const db = getFirestore();

  db.collection(TASKS_COLLECTION)
    .add(task)
    .then((docRef) =>
      response
        .status(201)
        .json(Response(201, 'Task added', { id: docRef.id, ...task }))
    )
    .catch((error) => {
      logger.error('Error adding task: ', error);
      response.status(500).json(Response(500, 'Error adding task', null));
    });
});

export const listTasks = onRequest({ cors: true }, (request, response) => {
  logger.info('List tasks', { structuredData: true });

  const db = getFirestore();

  db.collection(TASKS_COLLECTION)
    .get()
    .then((snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      response.status(200).json(Response(200, 'Tasks retrieved', tasks));
    })
    .catch((error) => {
      logger.error('Error getting tasks: ', error);
      response.status(500).json(Response(500, 'Error getting tasks', null));
    });
});

export const completeTask = onRequest({ cors: true }, (request, response) => {
  logger.info('Complete task', { structuredData: true });
  const data = request.body || {};

  try {
    TaskUpdateSchema.parse(data);
  } catch (error) {
    logger.error('Error validating task: ', error);
    response.status(400).json(Response(400, 'Error validating task', error));
    return;
  }

  const db = getFirestore();

  db.collection(TASKS_COLLECTION)
    .doc(data.id)
    .update({ status: 'completed' })
    .then(() =>
      response.status(200).json(Response(200, 'Task completed', data))
    )
    .catch((error) => {
      logger.error('Error completing task: ', error);
      response.status(500).json(Response(500, 'Error completing task', null));
    });
});

export const removeTask = onRequest({ cors: true }, (request, response) => {
  logger.info('Remove task', { structuredData: true });
  const data = request.body || {};

  try {
    TaskDeleteSchema.parse(data);
  } catch (error) {
    logger.error('Error validating task: ', error);
    response.status(400).json(Response(400, 'Error validating task', error));
    return;
  }

  const db = getFirestore();

  db.collection(TASKS_COLLECTION)
    .doc(data.id)
    .delete()
    .then(() => response.status(200).json(Response(200, 'Task removed', data)))
    .catch((error) => {
      logger.error('Error removing task: ', error);
      response.status(500).json(Response(500, 'Error removing task', null));
    });
});
