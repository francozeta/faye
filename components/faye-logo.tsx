import type * as React from "react"

import { cn } from "@/lib/utils"

type FayeLogoProps = React.ComponentProps<"svg">

export function FayeLogo({ className, ...props }: FayeLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
      {...props}
    >
      <g fill="none">
        <path
          d="M11.039 1.026a2 2 0 0 1 1.922 0l8.5 4.655A2 2 0 0 1 22.5 7.435v9.13a2 2 0 0 1-1.039 1.755l-8.5 4.654a2 2 0 0 1-1.922 0l-8.5-4.654A2 2 0 0 1 1.5 16.565v-9.13A2 2 0 0 1 2.539 5.68z"
          fill="url(#faye-logo-shell)"
        />
        <path
          d="M12.813 3.202a1.72 1.72 0 0 0-1.626 0L4.858 6.576a.5.5 0 0 0 .013.89l6.241 3.094a2 2 0 0 0 1.776 0l6.241-3.094a.5.5 0 0 0 .013-.89z"
          fill="url(#faye-logo-top)"
        />
        <path
          d="M11.188 3.202a1.72 1.72 0 0 1 1.625 0l6.329 3.374a.5.5 0 0 1-.013.89l-6.24 3.094-.215.09a2 2 0 0 1-1.348 0l-.215-.09-6.24-3.094a.5.5 0 0 1-.013-.89zm1.272.662a.98.98 0 0 0-.92 0L5.639 7.01l5.805 2.878c.35.173.762.173 1.112 0l5.805-2.878z"
          fill="url(#faye-logo-edge)"
        />
        <path
          d="M22.5 7.546v9.019a2 2 0 0 1-1.039 1.754l-8.5 4.655c-.3.164-.63.246-.961.246v-9.99c.326 0 .652-.08.947-.239l8.996-4.835c.269-.144.453-.363.557-.61"
          fill="url(#faye-logo-side)"
        />
      </g>
      <defs>
        <linearGradient id="faye-logo-shell" x1="12" x2="12" y1=".78" y2="23.22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#575757" />
          <stop offset="1" stopColor="#151515" />
        </linearGradient>
        <linearGradient id="faye-logo-top" x1="12" x2="12" y1="3" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5f5f6" stopOpacity=".72" />
          <stop offset="1" stopColor="#bfc1c7" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id="faye-logo-edge" x1="12" x2="12" y1="3" y2="7.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="faye-logo-side" x1="17.25" x2="17.25" y1="7.546" y2="23.22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#151515" />
          <stop offset="1" stopColor="#575757" />
        </linearGradient>
      </defs>
    </svg>
  )
}
