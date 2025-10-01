<template>
  <div class="container mx-auto px-4 py-12">
    <form 
      class="max-w-3xl mx-auto space-y-6" 
      @submit.prevent="onSubmit"
      >
      <template 
        v-for="(group, index) in groupedFields" 
        :key="index">
        <!-- Wrap consecutive half-width fields in a fieldset -->
        <div 
          v-if="group.halfWidth"
          class="grid grid-cols-2 gap-6">
          <FormFields
            v-for="field in group.fields"
            :key="field.id"
            :fieldType="field.fieldType"
            :name="field.name"
            :label="field.label"
            :type="field.type"
            :placeholder="field.placeholder"
            :description="field.description"
            :options="field.options"
          />
        </div>

        <!-- Render full-width fields normally -->
        <template v-else>
          <FormFields
            v-for="field in group.fields"
            :key="field.id"
            :fieldType="field.fieldType"
            :name="field.name"
            :label="field.label"
            :type="field.type"
            :placeholder="field.placeholder"
            :description="field.description"
            :options="field.options"
          />
        </template>
      </template>


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

  const groupedFields = computed(() => {
    const groups: { halfWidth: boolean; fields: any[]; legend?: string }[] = []
    let currentGroup: { halfWidth: boolean; fields: any[]; legend?: string } | null = null

    formFields.value?.forEach(field => {
      const isHalf = !!field.half_width
      const legend = field.legend || undefined

      if (!currentGroup || currentGroup.halfWidth !== isHalf) {
        // Start a new group
        currentGroup = { halfWidth: isHalf, fields: [field], legend: legend }
        groups.push(currentGroup)
      } else {
        // Add to current group
        currentGroup.fields.push(field)
        // Optionally, you can decide if legend should come from first field only
      }
    })

    return groups
  })

  const formValues: Record<string, any> = {}

  formFields.value.forEach(field => {
    let schema

    if (field.type !== 'number') {
      schema = z.string()
      
      // Required first
      if (field.required) {
        schema = schema.nonempty(`${field.error_message}`)
      }

      // Then min (only if value exists)
      if (field.min !== null && field.min !== undefined) {
        schema = schema.refine(val => !val || val.length >= field.min!, 
          `${field.label} needs to be at least ${field.min} characters`)
      }

      // Optional: max length
      if (field.max !== null && field.max !== undefined) {
        schema = schema.refine(val => !val || val.length <= field.max!, 
          `${field.label} cannot exceed ${field.max} characters`)
      }
    } else {
      schema = z.string()
      if (field.required) schema = schema.min(field.min || 1, `${field.label} needs to be at least ${field.min || 1} characters`)
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