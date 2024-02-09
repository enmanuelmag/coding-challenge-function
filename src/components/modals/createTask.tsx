import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { TaskCreateSchema, TaskCreateType } from '@schemas/task';

type CreateTaskModalProps = {
  opened: boolean;
  onConfirm: (data: TaskCreateType) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const CreateTaskModal = (props: CreateTaskModalProps) => {
  const form = useForm<TaskCreateType>({
    validate: zodResolver(TaskCreateSchema),
    initialValues: {
      title: '',
      description: '',
      status: 'not_completed',
    },
  });

  const { opened, onCancel, onConfirm, isLoading } = props;

  return (
    <Modal opened={opened} onClose={handleClose} title="Create new task">
      <form onSubmit={form.onSubmit(onConfirm)}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Type the title of the task"
          {...form.getInputProps('title')}
        />
        <TextInput
          withAsterisk
          label="Description"
          placeholder="Type the description of the task"
          {...form.getInputProps('description')}
        />

        <Group mt="xl" justify="flex-end">
          <Button onClick={handleClose} variant="subtle" color="grey">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            color="violet"
            loading={isLoading}
          >
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );

  function handleClose() {
    onCancel();
    form.reset();
  }
};
