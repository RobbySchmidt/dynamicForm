<template>
  <template v-if="fieldType === 'textarea'">
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel>{{ label }}</FormLabel>
        <FormControl>
          <Textarea
            :type="type" 
            :placeholder="placeholder" 
            v-bind="componentField"/>
        </FormControl>
        <FormDescription>
          {{ description }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else-if="fieldType === 'select'">
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel>{{ label }}</FormLabel>
        <FormControl>
          <Select
            v-bind="componentField">
            <SelectTrigger class="w-[180px]">
              <SelectValue :placeholder="placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{{ label }}</SelectLabel>
                <SelectItem v-for="val in options" :value="val">
                  {{ val }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>
          {{ description }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem>
        <FormLabel>{{ label }}</FormLabel>
        <FormControl>
          <Input 
            :type="type" 
            :placeholder="placeholder" 
            v-bind="componentField" />
        </FormControl>
        <FormDescription>
          {{ description }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </template>
</template>

<script setup lang="ts">
  const props = defineProps<{
    fieldType: string
    name: string
    label: string
    type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'tel'
    placeholder?: string
    description?: string
    options?: string[]
  }>()
</script>

<style scoped>

</style>