"use client"

import React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type TableMeta,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  Timer,
  Play,
  Pause,
  AlertCircleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateEditTaskDialog } from "./create-edit-task-dialog"
import { ConfirmDeleteDialog } from "@/components/teams/confirm-delete-dialog"
import type { Task, TaskStatus, TaskPriority } from "@/types"
import { cn, formatTime } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

interface TasksTableMeta extends TableMeta<Task> {
  onUpdateTask: (task: Partial<Task> & { id: string }) => void
  onDeleteTask: (taskId: string) => void
  toggleTimer: (taskId: string) => void
  userRole: "admin" | "user"
}

interface TasksTableProps {
  tasks: Task[]
  onTaskUpdate: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  toggleTimer?: (taskId: string) => void
  userRole?: "admin" | "user"
}

const statusVariant: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pendiente: "secondary",
  "En Progreso": "default",
  Revisión: "default",
  Completada: "outline",
  Cancelada: "destructive",
}

const priorityVariant: Record<TaskPriority, "default" | "secondary" | "destructive"> = {
  Baja: "secondary",
  Media: "default",
  Alta: "destructive",
  Urgente: "destructive",
}

const priorityIcons: Record<TaskPriority, React.ReactNode> = {
  Baja: <CheckCircle2 className="h-3 w-3" />,
  Media: <AlertTriangle className="h-3 w-3" />,
  Alta: <ArrowUp className="h-3 w-3" />,
  Urgente: <ArrowUp className="h-3 w-3" />,
}

const isTaskOverdue = (task: Task): boolean => {
  if (task.status === "Completada") return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

const taskStatusesArray: TaskStatus[] = ["Pendiente", "En Progreso", "Revisión", "Completada", "Cancelada"]
const taskPrioritiesArray: TaskPriority[] = ["Baja", "Media", "Alta", "Urgente"]

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todas"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Título
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Estado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus
      return (
        <Badge
          variant={statusVariant[status]}
          className={cn(
            status === "Completada" && "border-green-500/50 text-green-600 dark:text-green-400",
            status === "En Progreso" && "bg-blue-500/80 hover:bg-blue-500",
            status === "Revisión" && "bg-purple-500/80 hover:bg-purple-500 text-white",
          )}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(row.getValue(id) as string)
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Prioridad
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority
      return (
        <Badge variant={priorityVariant[priority]} className="gap-1 items-center">
          {priorityIcons[priority]}
          {priority}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(row.getValue(id) as string)
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha Límite
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const task = row.original
      const overdue = isTaskOverdue(task)
      return (
        <div className={cn("flex items-center gap-2", overdue && "text-destructive")}>
          {overdue && <AlertCircleIcon className="h-4 w-4" />}
          {row.getValue("dueDate")}
        </div>
      )
    },
  },
  {
    accessorKey: "timeSpent",
    header: "Tiempo Dedicado",
    cell: ({ row }) => {
      const task = row.original
      return (
        <div className={cn("flex items-center gap-1 font-mono tabular-nums", task.timerActive && "text-primary")}>
          <Timer className={cn("h-4 w-4", task.timerActive && "animate-pulse")} />
          {formatTime(task.timeSpent)}
        </div>
      )
    },
  },
  {
    accessorKey: "team",
    header: "Proyecto",
    cell: ({ row }) => <div>{row.getValue("team")}</div>,
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(row.getValue(id) as string)
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const task = row.original
      const meta = table.options.meta as TasksTableMeta
      const { onUpdateTask, onDeleteTask, toggleTimer, userRole } = meta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú de acciones</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => toggleTimer(task.id)}>
              {task.timerActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {task.timerActive ? "Pausar Temporizador" : "Iniciar Temporizador"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateTask({ id: task.id, status: "Completada" })}
              disabled={task.status === "Completada"}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar como Completada
            </DropdownMenuItem>
            {userRole === "admin" && (
              <CreateEditTaskDialog
                task={task}
                onTaskSave={(updatedTaskData) => onUpdateTask({ ...updatedTaskData, id: task.id })}
                triggerButton={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Tarea
                  </DropdownMenuItem>
                }
              />
            )}
            <DropdownMenuSeparator />
            <ConfirmDeleteDialog
              triggerButton={
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Tarea
                </DropdownMenuItem>
              }
              onConfirm={() => onDeleteTask(task.id)}
              itemName={`la tarea "${task.title}"`}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TasksTable({
  tasks,
  onTaskUpdate,
  onDeleteTask = () => {},
  toggleTimer = () => {},
  userRole = "admin",
}: TasksTableProps) {
  const data = tasks || []
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onUpdateTask: (task: Partial<Task> & { id: string }) => {
        const fullTask = tasks.find((t) => t.id === task.id)
        if (fullTask) {
          onTaskUpdate({ ...fullTask, ...task })
        }
      },
      onDeleteTask: onDeleteTask || (() => {}),
      toggleTimer: toggleTimer || (() => {}),
      userRole,
    } as TasksTableMeta,
  })

  const uniqueTeams = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return []
    const teams = new Set(tasks.map((task) => task.team))
    return Array.from(teams)
  }, [tasks])

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
          {/* Columna para 3 filtros (7 spans en LG) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <Input
              placeholder="Filtrar por título..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
              className="w-full"
            />
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) => table.getColumn("status")?.setFilterValue(value ? [value] : [])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {taskStatusesArray.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn("priority")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) => table.getColumn("priority")?.setFilterValue(value ? [value] : [])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Prioridades</SelectItem>
                {taskPrioritiesArray.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Columna para 2 filtros (5 spans en LG) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
            <Select
              value={(table.getColumn("team")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) => table.getColumn("team")?.setFilterValue(value ? [value] : [])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Proyectos</SelectItem>
                {uniqueTeams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Columnas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id === "dueDate"
                          ? "Fecha Límite"
                          : column.id === "team"
                            ? "Proyecto"
                            : column.id === "timeSpent"
                              ? "Tiempo Dedicado"
                              : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(isTaskOverdue(row.original) && "bg-destructive/5 hover:bg-destructive/10")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-4 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 text-sm text-muted-foreground text-right">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
            seleccionadas.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
