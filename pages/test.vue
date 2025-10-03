<template>
  <div class="container mx-auto py-12 px-4">
    <div v-for="data in test" class="2xl:w-10/12 mx-auto grid lg:grid-cols-2 gap-4 lg:gap-12 place-items-center">
      <NuxtPicture
        v-if="data.image"
        provider="directus"
        :src="data.image.filename_disk"
        format="avif,webp"
        width="4000"
        height="2250"
        sizes="sm:100vw lg:50vw"
        class="block w-full"
        :alt="data.image.title"/>

        <div class="space-y-4 xl:space-y-6">
          <div 
            v-if="data.text"
            v-html="data.text">
          </div>
  
          <Button as-child
            v-if="data.button" 
            v-for="btn in data.button">
            <NuxtLink 
              v-if="btn.label"
              :to="btn.url">
              {{ btn.label }}
            </NuxtLink>
          </Button>
        </div>

    </div>

          
  </div>
</template>

<script setup>
  const { getItems } = useDirectusItems()


  const { data: test } = await useAsyncData('test', () => {
    return getItems({      
      collection: "test",      
      params: { fields: ['*', '*.*'] },    
    })
  })

  console.log(test.value)
</script>

<style scoped>

</style>