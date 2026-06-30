"use client"

import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react"

export type FileWithPreview = {
  file: File
  id: string
  preview: string
}

export type FileUploadOptions = {
  accept?: string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  onFilesAdded?: (files: FileWithPreview[]) => void
  onFilesChange?: (files: FileWithPreview[]) => void
}

export type FileUploadState = {
  errors: string[]
  files: FileWithPreview[]
  isDragging: boolean
}

export type FileUploadActions = {
  clearFiles: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefObject<HTMLInputElement | null>
    type: "file"
  }
  handleDragEnter: (event: DragEvent<HTMLElement>) => void
  handleDragLeave: (event: DragEvent<HTMLElement>) => void
  handleDragOver: (event: DragEvent<HTMLElement>) => void
  handleDrop: (event: DragEvent<HTMLElement>) => void
  openFileDialog: () => void
  removeFile: (id: string) => void
}

export function useFileUpload(
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] {
  const {
    accept = "*",
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    multiple = false,
    onFilesAdded,
    onFilesChange,
  } = options
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<FileUploadState>({
    errors: [],
    files: [],
    isDragging: false,
  })

  const clearFiles = useCallback(() => {
    setState((current) => {
      current.files.forEach((item) => URL.revokeObjectURL(item.preview))
      onFilesChange?.([])

      if (inputRef.current) {
        inputRef.current.value = ""
      }

      return { errors: [], files: [], isDragging: false }
    })
  }, [onFilesChange])

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        return `El archivo supera ${formatBytes(maxSize)}.`
      }

      if (accept === "*") {
        return null
      }

      const acceptedTypes = accept.split(",").map((item) => item.trim())
      const fileExtension = `.${file.name.split(".").pop() ?? ""}`
      const accepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension.toLowerCase() === type.toLowerCase()
        }

        if (type.endsWith("/*")) {
          return file.type.startsWith(`${type.split("/")[0]}/`)
        }

        return file.type === type
      })

      return accepted ? null : "Sube una imagen valida."
    },
    [accept, maxSize]
  )

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incomingFiles = Array.from(files)

      if (incomingFiles.length === 0) {
        return
      }

      const currentFiles = multiple
        ? incomingFiles.slice(0, Math.max(maxFiles - state.files.length, 0))
        : incomingFiles.slice(0, 1)
      const errors: string[] = []
      const validFiles: FileWithPreview[] = []

      currentFiles.forEach((file) => {
        const error = validateFile(file)

        if (error) {
          errors.push(error)
          return
        }

        validFiles.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`,
          preview: URL.createObjectURL(file),
        })
      })

      setState((current) => {
        if (!multiple) {
          current.files.forEach((item) => URL.revokeObjectURL(item.preview))
        }

        const nextFiles = multiple ? [...current.files, ...validFiles] : validFiles
        onFilesChange?.(nextFiles)

        return {
          errors,
          files: nextFiles,
          isDragging: false,
        }
      })

      if (validFiles.length > 0) {
        onFilesAdded?.(validFiles)
      }

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [
      maxFiles,
      multiple,
      onFilesAdded,
      onFilesChange,
      state.files.length,
      validateFile,
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      setState((current) => {
        const removed = current.files.find((item) => item.id === id)
        const nextFiles = current.files.filter((item) => item.id !== id)

        if (removed) {
          URL.revokeObjectURL(removed.preview)
        }

        onFilesChange?.(nextFiles)

        return {
          ...current,
          errors: [],
          files: nextFiles,
        }
      })
    },
    [onFilesChange]
  )

  const handleDragEnter = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setState((current) => ({ ...current, isDragging: true }))
  }, [])

  const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setState((current) => ({ ...current, isDragging: false }))
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()

      setState((current) => ({ ...current, isDragging: false }))

      if (event.dataTransfer.files.length > 0) {
        addFiles(event.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        addFiles(event.target.files)
      }
    },
    [addFiles]
  )

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      accept: props.accept ?? accept,
      multiple: props.multiple ?? multiple,
      onChange: handleFileChange,
      ref: inputRef,
      type: "file" as const,
    }),
    [accept, handleFileChange, multiple]
  )

  return [
    state,
    {
      clearFiles,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
    },
  ]
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes"
  }

  const factor = 1024
  const precision = Math.max(decimals, 0)
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(factor)),
    sizes.length - 1
  )

  return `${Number.parseFloat((bytes / factor ** index).toFixed(precision))} ${
    sizes[index]
  }`
}
