"use client"

import * as React from "react"
import { useRouter } from "next/navigation" // Import useRouter
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Edit3, Trash2, Search } from "lucide-react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateEditUserDialog } from "./create-edit-user-dialog"
import { ConfirmDeleteDialog } from "@/components/teams/confirm-delete-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { UserProfile, Project } from "@/types"

interface UsersTableMeta extends TableMeta<UserProfile> {
  onUpdateUser: (user: Partial<UserProfile> & { id: string }) => void
  onDeleteUser: (userId: string) => void
  allProjects: Project[]
}

interface UsersTableProps {
  usersData: UserProfile[]
  allProjects: Project[]
  onUpdateUser: (user: Partial<UserProfile> & { id: string }) => void
  onDeleteUser: (userId: string) => void
}

export const columns: ColumnDef<UserProfile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.avatarUrl || `/placeholder.svg?width=32&height=32&query=${row.original.name}`}
            alt={row.original.name}
          />
          <AvatarFallback>{row.original.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "jobTitle",
    header: "Puesto",
    cell: ({ row }) => <div>{row.original.jobTitle || <span className="text-muted-foreground">N/A</span>}</div>,
  },
  {
    accessorKey: "assignedProjects",
    header: "Proyectos Asignados",
    cell: ({ row, table }) => {
      const assignedProjects = row.original.assignedProjects
      const meta = table.options.meta as UsersTableMeta
      const allProjects = meta.allProjects

      if (!assignedProjects || assignedProjects.length === 0) {
        return <span className="text-muted-foreground">Ninguno</span>
      }

      const MAX_DISPLAY_PROJECTS = 2
      const displayedAssignments = assignedProjects.slice(0, MAX_DISPLAY_PROJECTS)
      const remainingAssignmentsCount = assignedProjects.length - MAX_DISPLAY_PROJECTS

      return (
        <div className="flex flex-wrap gap-1 items-center">
          {displayedAssignments.map((assignment) => {
            const project = allProjects.find((p) => p.id === assignment.projectId)
            return (
              <Badge key={assignment.projectId} variant="secondary">
                {project?.name || assignment.projectId} ({assignment.role})
              </Badge>
            )
          })}
          {remainingAssignmentsCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline">+{remainingAssignmentsCount}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <ScrollArea className="max-h-40">
                    <ul className="list-disc pl-4 text-xs">
                      {assignedProjects.slice(MAX_DISPLAY_PROJECTS).map((assignment) => {
                        const project = allProjects.find((p) => p.id === assignment.projectId)
                        return (
                          <li key={assignment.projectId}>
                            {project?.name || assignment.projectId} ({assignment.role})
                          </li>
                        )
                      })}
                    </ul>
                  </ScrollArea>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const userAssignedProjectIds = row.original.assignedProjects.map((ap) => ap.projectId)
      if (value.length === 0) return true
      return value.some((filterProjectId) => userAssignedProjectIds.includes(filterProjectId))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha Creación
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original
      const meta = table.options.meta as UsersTableMeta
      const { onUpdateUser, onDeleteUser, allProjects } = meta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <CreateEditUserDialog
              user={user}
              allProjects={allProjects}
              onUserSave={(updatedUserData) => onUpdateUser({ ...updatedUserData, id: user.id })}
              triggerButton={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit3 className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
              }
            />
            <DropdownMenuSeparator />
            <ConfirmDeleteDialog
              triggerButton={
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              }
              onConfirm={() => onDeleteUser(user.id)}
              itemName={`al usuario ${user.name}`}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UsersTable({ usersData, allProjects, onUpdateUser, onDeleteUser }: UsersTableProps) {
  const router = useRouter() // Initialize useRouter
  const data = usersData
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onUpdateUser,
      onDeleteUser,
      allProjects,
    } as UsersTableMeta,
  })

  const allProjectIdsFromUsers = React.useMemo(() => {
    const ids = new Set<string>()
    usersData.forEach((user) => user.assignedProjects.forEach((ap) => ids.add(ap.projectId)))
    return Array.from(ids).map((id) => ({
      id,
      name: allProjects.find((p) => p.id === id)?.name || id,
    }))
  }, [usersData, allProjects])

  const handleRowClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`)
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 py-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filtrar por nombre..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="w-full pl-8 trello-card border-primary/20 focus:border-primary"
            />
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filtrar por email..."
              value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
              className="w-full pl-8 trello-card border-primary/20 focus:border-primary"
            />
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filtrar por puesto..."
              value={(table.getColumn("jobTitle")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("jobTitle")?.setFilterValue(event.target.value)}
              className="w-full pl-8 trello-card border-primary/20 focus:border-primary"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between trello-button-secondary">
                Proyectos <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width] trello-card">
              <DropdownMenuItem onSelect={() => table.getColumn("assignedProjects")?.setFilterValue([])}>
                Todos
              </DropdownMenuItem>
              {allProjectIdsFromUsers.map((project) => (
                <DropdownMenuCheckboxItem
                  key={project.id}
                  checked={
                    (table.getColumn("assignedProjects")?.getFilterValue() as string[] | undefined)?.includes(
                      project.id,
                    ) ?? false
                  }
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table.getColumn("assignedProjects")?.getFilterValue() as string[] | undefined) || []
                    if (checked) {
                      table.getColumn("assignedProjects")?.setFilterValue([...currentFilter, project.id])
                    } else {
                      table
                        .getColumn("assignedProjects")
                        ?.setFilterValue(currentFilter.filter((id) => id !== project.id))
                    }
                  }}
                >
                  {project.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between trello-button-secondary">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="trello-card">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  let displayName = column.id
                  if (column.id === "createdAt") displayName = "Fecha Creación"
                  if (column.id === "assignedProjects") displayName = "Proyectos Asignados"
                  if (column.id === "jobTitle") displayName = "Puesto"
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {displayName}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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
                    onClick={() => handleRowClick(row.original.id)} // Add onClick handler
                    className="cursor-pointer" // Add cursor pointer
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay usuarios.
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
