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

  const formFields = ref([
    {
      fieldType: 'select',
      name: 'title',
      label: 'Title',
      placeholder: 'Select your title',
      options: ['Male', 'Female', 'Banane']
    },
    {
      fieldType: 'input',
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'You Username',
    },
    {
      fieldType: 'textarea',
      name: 'message',
      label: 'Your Message',
      type: 'text',
      placeholder: 'Type your message here',
    },
  ])

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