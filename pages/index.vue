<template>
  <div class="container mx-auto px-4 py-12">
    <form 
      class="max-w-3xl mx-auto space-y-6" 
      @submit.prevent="onSubmit"
    >
      <FormFields
        v-for="field in formFields"
        :key="field.id"
        :fieldType="field.fieldType"
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :description="field.description"
        :options="field.options"
      />

      <Button type="submit">Submit</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import * as z from 'zod'

  const { getItems } = useDirectusItems()


  const { data: formFields } = await useAsyncData('dynamic_form', () => {
    return getItems({      
      collection: "dynamic_form",      
      params: { fields: ['*', '*.*'] },    
    })
  })

  const formValues: Record<string, any> = {}

  formFields.value.forEach(field => {
    let schema

    if (field.type === 'number') {
    
      schema = z.preprocess(
        val => {
          if (val === '' || val === null || val === undefined) return undefined
          return Number(val)
        },
        z.number().optional()
      )

      if (field.required) schema = schema.refine(val => !isNaN(val), `${field.error_message}`)
      if (field.min !== null && field.min !== undefined) schema = schema.refine(val => val >= field.min!, `${field.label} must be at least ${field.min}`)
      if (field.max !== null && field.max !== undefined) schema = schema.refine(val => val <= field.max!, `${field.label} must be at most ${field.max}`)
    } else {
    
      schema = z.string()
      if (field.required) schema = schema.min(field.min || 1, `${field.error_message}`)
    }

    formValues[field.name] = schema
  })

  const formSchema = toTypedSchema(z.object(formValues))

  const initialValues: Record<string, any> = {}

  formFields.value.forEach(field => {
    if (field.type === 'number') {
      initialValues[field.name] = null
    } else {
      initialValues[field.name] = ''
    }
  })

  const { handleSubmit, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues,
  })

  const onSubmit = handleSubmit(values => {
    console.log('Form submitted:', values)

    resetForm()
  })
</script>