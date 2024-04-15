<script setup>
onMounted(() => {
  window?.google?.accounts?.id.renderButton(
    document.getElementById('buttonDiv'),
    {
      type: 'icon',
    }
  );
});
</script>
<template>
  <div id="buttonDiv"></div>
</template>
