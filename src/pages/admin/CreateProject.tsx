import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { projectsApi } from "@/lib/api/projects";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";

const SERVICE_OPTIONS = [
  "Build a custom LLM",
  "Build an agent",
  "Take a readymade agent",
  "Create an AI App"
] as const;

const createProjectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  project_description: z.string().min(1, "Project description is required"),
  tasks: z.array(
    z.object({
      task_name: z.string(),
      is_default: z.boolean().optional(),
    })
  ),
  services: z.array(
    z.object({
      service_name: z.enum(SERVICE_OPTIONS, {
        required_error: "Please select a service",
      }),
      service_description: z.string().min(1, "Service description is required"),
      cost: z.string().min(1, "Cost is required"),
      poc_cost: z.string().min(1, "POC cost is required"),
      others: z.object({
        estimated_timeline: z.string().min(1, "Timeline is required"),
        poc_timeline: z.string().min(1, "POC timeline is required"),
      }),
    })
  ).min(1, "At least one service is required"),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

export default function CreateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [projectData, setProjectData] = useState<Project | null>(null);

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      tasks: [
        { task_name: "Fill up user details", is_default: true },
        { task_name: "Agree to terms", is_default: true }
      ],
      services: [],
    },
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = 
    useFieldArray({
      control: form.control,
      name: "tasks",
    });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const response = await projectsApi.getById(id);
          const project = response.data;
          setProjectData(project);

          form.reset({
            project_name: project.project_name,
            project_description: project.project_description,
            tasks: [
              ...project.tasks?.map(task => ({
                task_name: task.task_name,
                is_default: task.task_name === "Fill up user details" || 
                           task.task_name === "Agree to terms",
                status: task.status
              })) || []
            ],
            services: (project.services || []).map(service => ({
              service_name: service.service_name,
              service_description: service.service_description,
              cost: service.cost.toString(),
              poc_cost: service.poc_cost.toString(),
              others: {
                estimated_timeline: service.others.estimated_timeline,
                poc_timeline: service.others.poc_timeline,
              },
            })),
          });
        } catch (error) {
          toast.error("Failed to load project");
          navigate("/vanij-poc/admin");
        }
      };

      fetchProject();
    }
  }, [id, isEditMode, form, navigate]);

  const onSubmit = async (data: CreateProjectValues) => {
    try {
      const formattedData = {
        project_name: data.project_name,
        project_description: data.project_description,
        status: "active",
        tasks: data.tasks.map((task) => {
          if (isEditMode) {
            const existingTask = projectData?.tasks?.find(
              t => t.task_name === task.task_name
            );
            if (existingTask) {
              return {
                task_name: task.task_name,
                status: existingTask.status
              };
            }
          }
          return {
            task_name: task.task_name,
            status: "pending"
          };
        }),
        services: data.services.map((service) => ({
          service_name: service.service_name,
          service_description: service.service_description,
          status: "planned",
          cost: service.cost,
          poc_cost: service.poc_cost,
          others: {
            estimated_timeline: service.others.estimated_timeline,
            poc_timeline: service.others.poc_timeline,
          },
        })),
      };

      if (isEditMode) {
        await projectsApi.update(id, formattedData);
        toast.success("Project updated successfully");
        navigate(`/vanij-poc/admin/projects/${id}`);
      } else {
        const response = await projectsApi.create(formattedData);
        toast.success("Project created successfully");
        navigate(`/vanij-poc/admin/projects/${response.data.id}`);
      }
    } catch (error) {
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/vanij-poc/admin")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter project description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tasks Section */}
            {/* <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Tasks</h3>
                  <p className="text-sm text-muted-foreground">Project tasks</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendTask({ task_name: "", is_default: false })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-4">
                {taskFields.map((field, index) => {
                  const isDefaultTask = form.getValues(`tasks.${index}.is_default`);
                  
                  return (
                    <div key={field.id} className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`tasks.${index}.task_name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Enter task description"
                                disabled={isDefaultTask}
                                className="resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!isDefaultTask && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-10"
                          onClick={() => removeTask(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card> */}

            {/* Services Section */}
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Add at least one service to continue
                  </p>
                  {form.formState.errors.services?.root && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.services.root.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({
                    service_name: "",
                    service_description: "",
                    cost: "",
                    poc_cost: "",
                    others: {
                      estimated_timeline: "",
                      poc_timeline: "",
                    },
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Service {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.service_name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_OPTIONS.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.service_description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter service description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`services.${index}.poc_cost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>POC Cost</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Free, $50, Contact Us" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`services.${index}.others.poc_timeline`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>POC Timeline</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 1 month" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`services.${index}.cost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Cost</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Free, $200, Contact Us" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`services.${index}.others.estimated_timeline`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Timeline</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 3 months" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Card>

            <Button 
              type="submit" 
              className="w-full"
              disabled={fields.length === 0}
            >
              {isEditMode ? "Update Project" : "Create Project"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
} 