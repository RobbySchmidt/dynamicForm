<template>
  <div class="container h-screen grid content-center">
    <div class="lg:w-9/12 mx-auto text-center space-y-12">
      <div class="">
        <ThumbsUp class="mx-auto size-24 text-green-500" />
      </div>
      <div class="space-y-6">
        <h1 class="text-2xl text-green-500">Deine Termin wurde erfolgreich gebucht.</h1>
        <Button 
          as-child
          class="bg-green-500 hover:bg-green-600 duration-300 ease-in-out mx-auto">
          <NuxtLink to="/calendar" >
            zurück zur Startseite
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ThumbsUp } from "lucide-vue-next"
  
</script>