import type React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface TaskStatsProps {
  completed: number
  inProgress: number
  todo: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

const TaskStats: React.FC<TaskStatsProps> = ({ completed, inProgress, todo }) => {
  const data = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "To Do", value: todo },
  ]

  const chartConfig = {
    innerRadius: "60%",
    outerRadius: "80%",
    paddingAngle: 5,
  }

  const totalTasks = completed + inProgress + todo

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Task Statistics</h2>
      {totalTasks === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center h-full">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={chartConfig.outerRadius}
                    innerRadius={chartConfig.innerRadius}
                    paddingAngle={chartConfig.paddingAngle}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <ul className="mt-4 space-y-2">
            <li>
              <span className="font-medium">Completed:</span> {completed}
            </li>
            <li>
              <span className="font-medium">In Progress:</span> {inProgress}
            </li>
            <li>
              <span className="font-medium">To Do:</span> {todo}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

interface ChartContainerProps {
  children: React.ReactNode
  config: any
  className?: string
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export default TaskStats
