<script setup>
import { mdiBallotOutline, mdiGithub } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <RouterView />
    </SectionMain>
  </LayoutAuthenticated>
</template>
