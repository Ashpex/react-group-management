import {
  Container, Group, Box, Button, Breadcrumbs, Anchor, Grid, Tooltip, Loader,
  Select, TextInput, Divider, Center, Text, createStyles, ActionIcon, NavLink,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
  IconPlus, IconGripVertical, IconX, IconDeviceFloppy, IconPresentationAnalytics, IconTrash,
} from '@tabler/icons';
import {
  useState, useEffect, useCallback,
} from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import {
  useParams, Link, useNavigate,
} from 'react-router-dom';

import MultipleChoiceSlideTemplate from '../slideTemplate/multipleChoice';

import presentationApi, {
  PresentationWithUserCreated as Presentation,
  CompactSlide as Slide,
} from '@/api/presentation';
import * as notificationManager from '@/pages/common/notificationManager';
import StrictModeDroppable from '@/pages/common/strictModeDroppable';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { SlideType } from '@/utils/constants';

interface FormProps {
  question: string
  options: {
    value: string
    quantity: number
  }[]
}

interface Props {
  slideInfo: Slide | undefined
  form: UseFormReturnType<FormProps>
}

interface SlideInfo {
  id: string
  label: string
  description: string
  url: string
}

const useStyles = createStyles((theme) => ({
  inputLabel: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[8],
  },
}));

const MultipleChoiceSlideContentSetting = ({ slideInfo, form }: Props) => {
  const { classes } = useStyles();

  useEffect(() => {
    if (slideInfo?.title) {
      form.setFieldValue('question', slideInfo?.title !== 'New Slide' ? slideInfo?.title : '');
    }

    if (slideInfo && slideInfo?.options.length !== 0) {
      form.setFieldValue('options', slideInfo.options.map((i) => ({
        ...i,
        quantity: i.quantity || 0,
      })));
    } else {
      form.setFieldValue('options', [{ value: '', quantity: 0 }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideInfo]);

  const handleAddOption = () => {
    form.insertListItem('options', {
      value: '',
      quantity: 0,
    });
  };

  const handleRemoveOption = (index: number) => {
    form.removeListItem('options', index);
  };

  const fields = form.values.options.map((_, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps} spacing="xs">
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <TextInput
            placeholder={`Option ${index + 1}`}
            styles={() => ({ root: { flexGrow: 2 } })}
            {...form.getInputProps(`options.${index}.value`)}
          />
          <Tooltip label="Remove">
            <ActionIcon onClick={() => handleRemoveOption(index)}><IconX /></ActionIcon>
          </Tooltip>
        </Group>
      )}
    </Draggable>
  ));

  return (
    <Box>
      <TextInput
        label="Your question"
        placeholder="Your question here"
        classNames={{ label: classes.inputLabel }}
        {...form.getInputProps('question')}
      />
      <Box my="md">
        <Text className={classes.inputLabel}>Options</Text>
        <DragDropContext
          onDragEnd={
            ({ destination, source }) => form.reorderListItem('options', { from: source.index, to: destination?.index || 0 })
          }
        >
          <StrictModeDroppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        <Group position="center" mt="md">
          <Button
            onClick={handleAddOption}
            leftIcon={<IconPlus />}
            variant="light"
            w="100%"
          >
            Add option
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default function EditPresentation() {
  const [presentationData, setPresentationData] = useState<Presentation>();
  const [slideData, setSlideData] = useState<Slide>();
  const [slideType, setSlideType] = useState<string | null>(null);
  const [slideList, setSlideList] = useState<SlideInfo[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { presentationId, slideId } = useParams();
  const { classes } = useStyles();
  const navigate = useNavigate();

  const form = useForm<FormProps>({
    initialValues: {
      question: '',
      options: [
        {
          value: '',
          quantity: 0,
        },
      ],
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      setPresentationData(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }

    setLoading(false);
  }, [presentationId]);

  useEffect(() => {
    if (presentationData) {
      const currentSlideData = presentationData.slides.find((i) => i._id === slideId);
      const slideListData = presentationData.slides.map((i, index) => ({
        id: i._id,
        label: `Slide ${index + 1}`,
        description: i.title,
        url: `/presentation/${presentationId}/${i._id}/edit`,
      }));

      setSlideData(currentSlideData);
      setSlideType(currentSlideData?.slideType || null);
      setSlideList(slideListData);
    }
  }, [presentationData, presentationId, slideId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breadcrumbsItems = [
    { title: 'My presentations', to: '/presentations' },
    { title: presentationData?.name || '', to: '#' },
  ];

  const slideTypeOptions = [
    { value: SlideType.MultipleChoice, label: 'Multiple Choice' },
    // { value: SLIDE_TYPE.HEADING, label: 'Heading' },
    // { value: SLIDE_TYPE.PARAGRAPH, label: 'Paragraph' },
  ];

  const handleCreateNewSlide = async () => {
    try {
      const { data: response } = await presentationApi.createSlide(presentationId);

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      const { data: response } = await presentationApi.updateMultipleChoiceSlide(slideId, {
        question: form.values.question,
        options: form.values.options.filter((i) => i.value),
      });

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleDeleteSlide = async () => {
    try {
      const { data: response } = await presentationApi.deleteSlide(slideId);
      const randomSlide = slideList.find((i) => i.id !== slideId);

      notificationManager.showSuccess('', response.message);
      navigate(`/presentation/${presentationId}/${randomSlide?.id}/edit`);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  return (
    <Container fluid>
      <Group position="apart">
        <Breadcrumbs>
          {breadcrumbsItems.map((item, index) => (
            <Anchor key={index} component={Link} to={item.to}>
              {item.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Group spacing="xs">
          <Button leftIcon={<IconPlus />} variant="outline" onClick={handleCreateNewSlide}>
            <Text>New slide</Text>
          </Button>
          <Button leftIcon={<IconDeviceFloppy />} variant="outline" onClick={handleSave}>
            <Text>Save</Text>
          </Button>
          <Link to={`/presentation/active/${presentationId}`}>
            <Button leftIcon={<IconPresentationAnalytics />}>
              <Text>Present</Text>
            </Button>
          </Link>
        </Group>
      </Group>

      <Grid my="md" gutter="md">
        <Grid.Col span={2}>
          {slideList.map((i) => (
            <NavLink
              key={i.id}
              label={i.label}
              description={i.description}
              active={i.id === slideId}
              variant="filled"
              component={Link}
              to={i.id === slideId ? '#' : i.url}
            />
          ))}
        </Grid.Col>
        <Grid.Col span={10}>
          {
            isLoading
              ? (
                <Center>
                  <Loader />
                </Center>
              )
              : (
                <Grid>
                  <Grid.Col span={8}>
                    <MultipleChoiceSlideTemplate
                      question={slideData?.title}
                      options={slideData?.options}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} p={16}>
                    <Select
                      label="Slide type"
                      data={slideTypeOptions}
                      value={slideType}
                      onChange={setSlideType}
                      classNames={{ label: classes.inputLabel }}
                    />
                    <Divider my="md" />
                    <MultipleChoiceSlideContentSetting slideInfo={slideData} form={form} />
                    <Divider my="xl" />
                    <Group position="center" mt="xl">
                      <Button
                        color="red"
                        leftIcon={<IconTrash />}
                        onClick={handleDeleteSlide}
                        disabled={slideList.length === 1}
                      >
                        Delete slide
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              )
          }
        </Grid.Col>
      </Grid>
    </Container>
  );
}
