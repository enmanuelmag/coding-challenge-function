import {
  Text,
  Flex,
  Badge,
  Group,
  Table,
  Paper,
  Button,
  Center,
  Loader,
  Container,
  ActionIcon,
} from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconCheck } from '@tabler/icons-react';
import { CreateTaskModal } from '@components/modals/createTask';

import { TaskCreateType, type TaskType } from '@schemas/task';

import { RepositoryData } from '@api/db';

import { StatusTask } from '@constants/status';

import './App.css';

function App() {
  const queryClient = useQueryClient();
  const [opened, handlers] = useDisclosure(false);
  const taskQuery = useQuery<TaskType[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => RepositoryData.listTask(),
  });

  const createTask = useMutation<
    TaskType | null,
    Error,
    TaskCreateType,
    TaskCreateType
  >({
    mutationKey: ['createTask'],
    mutationFn: async (data) => RepositoryData.addTask(data),
    onSuccess: () => {
      handlers.close();
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Task created successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: error.message,
      });
    },
  });

  const completeTask = useMutation<TaskType | null, Error, TaskType, TaskType>({
    mutationKey: ['completeTask'],
    mutationFn: async (data) => RepositoryData.completeTask(data),
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Task completed successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: error.message,
      });
    },
  });

  const removeTask = useMutation<boolean, Error, TaskType, TaskType>({
    mutationKey: ['removeTask'],
    mutationFn: async (data) => RepositoryData.removeTask(data),
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Task removed successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: error.message,
      });
    },
  });

  React.useEffect(() => {
    if (taskQuery.isError) {
      notifications.show({
        title: 'Error',
        message: taskQuery.error?.message,
        color: 'red',
      });
    }
  }, [taskQuery.error, taskQuery.isError]);

  return (
    <Container size="md" pt="xl">
      <Paper shadow="xs" px="xl" py="md" mt="xs">
        <Text size="xl" pt="md" pb="xl" fw={800}>
          Tasks{' '}
          <Text span size="xl" c="violet" fw={800}>
            Management
          </Text>
        </Text>
        <Button
          color="violet"
          variant="filled"
          mb="xl"
          onClick={() => handlers.open()}
        >
          Add task
        </Button>
        {taskQuery.isPending && (
          <Center>
            <Flex direction="column" align="center">
              <Loader color="violet" size="xl" mb="xl" />
              <Text>Loading tasks</Text>
            </Flex>
          </Center>
        )}
        {!taskQuery.isPending && taskQuery.data && (
          <Table striped highlightOnHover captionSide="bottom">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {taskQuery.data &&
                taskQuery.data.map((task, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{task.title}</Table.Td>
                    <Table.Td>{task.description}</Table.Td>
                    <Table.Td>
                      <Badge color={StatusTask[task.status].color}>
                        {StatusTask[task.status].label}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <ActionIcon
                          color="green"
                          aria-label="Complete task"
                          disabled={task.status === 'completed'}
                          variant="filled"
                          loading={completeTask.isPending}
                          onClick={() => handleCompleteTask(task)}
                        >
                          <IconCheck color="white" />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          aria-label="Remove task"
                          loading={removeTask.isPending}
                          onClick={() => handleRemoveTask(task)}
                        >
                          <IconTrash color="red" />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
            <Table.Caption>
              {taskQuery.data.length
                ? `Total tasks: ${taskQuery.data.length}`
                : 'No tasks found'}
            </Table.Caption>
          </Table>
        )}
      </Paper>
      <CreateTaskModal
        opened={opened}
        onCancel={() => handlers.close()}
        isLoading={createTask.isPending}
        onConfirm={handleCreateTask}
      />
    </Container>
  );

  function handleCreateTask(data: TaskCreateType) {
    if (createTask.isPending) return;
    createTask.mutate(data);
  }

  function handleCompleteTask(data: TaskType) {
    if (completeTask.isPending) return;
    completeTask.mutate(data);
  }

  function handleRemoveTask(data: TaskType) {
    if (removeTask.isPending) return;
    removeTask.mutate(data);
  }
}

export default App;
