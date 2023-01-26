<script setup>
import { containerMaxW } from "@/config.js";
import BaseLevel from "@/components/BaseLevel.vue";
import JustboilLogo from "@/components/JustboilLogo.vue";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b
          >&copy;{{ year }},
          <a href="https://github.com/payamQorbanpour" target="_blank">Payam Qorbanpour</a>.</b
        >
        <slot />
      </div>
      <div class="md:py-2">
        <a href="https://github.com/payamQorbanpour">
          <img src="../../public/logo.png" class="inline-flex justify-center items-center w-18 h-14 flex-none">
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
