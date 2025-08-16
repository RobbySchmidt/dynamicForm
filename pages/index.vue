<template>
  <div class="container mx-auto px-4 py-12">
    <form 
      class="max-w-3xl mx-auto space-y-6" 
      @submit.prevent="onSubmit">

      <FormFields
        v-for="field in formFields"
        :fieldType="field.fieldType"
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :description="field.description"
        :options="field.options"
      />

      <Button type="submit">
        Submit
      </Button>
    </form>
  </div>
</template>

<script setup>
  const { getItems } = useDirectusItems();

  const {
    data: formFields,
    pendingFormFields,
    errorFormFields,
  } = await useAsyncData('dynamic_form', () => {
    return getItems({      
      collection: "dynamic_form",      
      params: { 
        fields: ['*', '*.*'],
      },    
    })
  },
  {
    transform: (data) => data
  })

  console.log(formFields.value)

  import { toTypedSchema } from "@vee-validate/zod"
  import { useForm } from "vee-validate"
  import { h } from "vue"
  import * as z from "zod"

  const formSchema = toTypedSchema(z.object({
    title: z.string().optional(),
    username: z.string().min(2).max(50),
    message: z.string().min(2).max(50),
  }))

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  })

  const onSubmit = handleSubmit((values) => {
    console.log(values)
  })
</script>