"use client"

import * as React from "react"
import {
  CameraAiIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { FayeLogo } from "@/components/faye-logo"
import { Button } from "@/components/ui/button"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/components/ui/marker"
import { useFileUpload } from "@/hooks/use-file-upload"
import type { EveEmptyInputResponse } from "@/lib/eve/types"
import { cn } from "@/lib/utils"

type FayeDropzoneProps = {
  isAnalyzing: boolean
  notice: EveEmptyInputResponse | null
  onFile: (file: File | null) => void | Promise<void>
  preview: {
    name: string
    sizeLabel: string
    url: string
  } | null
}

const maxImageSize = 10 * 1024 * 1024

export function FayeDropzone({
  isAnalyzing,
  notice,
  onFile,
  preview,
}: FayeDropzoneProps) {
  const [
    { errors, isDragging },
    {
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxFiles: 1,
    maxSize: maxImageSize,
    onFilesAdded: (files) => {
      void onFile(files[0]?.file ?? null)
    },
  })

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }

    event.preventDefault()
    openFileDialog()
  }

  return (
    <div
      aria-label="Entrada visual del residuo"
      className={cn(
        "relative grid min-h-0 touch-manipulation place-items-center overflow-hidden rounded-lg border border-dashed border-border bg-card/20 p-3 outline-none transition-colors hover:bg-card/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:p-4",
        isDragging && "border-foreground bg-muted/40"
      )}
      data-dragging={isDragging || undefined}
      onClick={openFileDialog}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <input
        {...getInputProps({
          "aria-label": "Imagen del residuo",
          capture: "environment",
          className: "sr-only",
        })}
      />

      {preview ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-2 sm:gap-4 sm:p-6">
          <div className="grid h-[min(40dvh,320px)] w-[min(88vw,780px)] max-w-full place-items-center overflow-hidden rounded-md border border-border bg-background/40 p-2 sm:h-[min(46dvh,360px)] sm:w-[min(72vw,780px)] sm:p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.url}
              alt={`Residuo subido: ${preview.name}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <Marker
            variant="separator"
            className="w-[min(88vw,780px)] max-w-full sm:w-[min(72vw,780px)]"
          >
            <MarkerIcon>
              <HugeiconsIcon icon={SparklesIcon} />
            </MarkerIcon>
            <MarkerContent className="shimmer">
              {isAnalyzing ? "Analizando" : "Imagen cargada"}
            </MarkerContent>
          </Marker>
        </div>
      ) : isAnalyzing ? (
        <DropzoneMessage
          icon={SparklesIcon}
          title="Analizando"
          description=""
        />
      ) : notice ? (
        <DropzoneMessage
          icon={SparklesIcon}
          title={notice.title}
          description={notice.message}
          action={<UploadAction onOpen={openFileDialog} />}
        />
      ) : (
        <DropzoneMessage
          icon={FayeLogo}
          title="Clasifica un residuo"
          description="Suelta una foto o abre la camara."
          action={
            <UploadAction onOpen={openFileDialog} />
          }
        />
      )}

      {errors.length > 0 ? (
        <p
          aria-live="polite"
          className="absolute bottom-3 left-3 right-3 text-center text-xs text-destructive"
          role="alert"
        >
          {errors[0]}
        </p>
      ) : (
        null
      )}
    </div>
  )
}

function DropzoneMessage({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: React.ReactNode
  description: string
  icon: typeof SparklesIcon | typeof FayeLogo
  title: string
}) {
  const isLogo = Icon === FayeLogo

  return (
    <div className="flex max-w-[20rem] flex-col items-center gap-4 text-center sm:max-w-xl sm:gap-5">
      <div className="grid size-11 place-items-center rounded-full border border-border bg-muted/30 sm:size-12">
        {isLogo ? (
          <FayeLogo className="size-5" />
        ) : (
          <HugeiconsIcon icon={Icon as typeof SparklesIcon} size={22} />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

function UploadAction({
  label = "Imagen",
  onOpen,
}: {
  label?: string
  onOpen: () => void
}) {
  return (
    <Button
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      size="lg"
      type="button"
    >
      <HugeiconsIcon icon={CameraAiIcon} data-icon="inline-start" />
      {label}
    </Button>
  )
}
