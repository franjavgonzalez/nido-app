import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ hover = false, padding = 'md', className, children, ...props }: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-5', lg: 'p-6' }
  return (
    <div
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)]',
        paddings[padding],
        hover && 'transition-colors duration-150 hover:bg-[var(--bg-card-hover)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
