<script lang="ts" setup>

const colorMode = useColorMode();

const formatedColorMode = computed(() => {
  return colorMode.preference.charAt(0).toUpperCase() + colorMode.preference.slice(1);
});

</script>

<template>
 <div class="flex flex-col items-start gap-2">
    <div class="text-muted-foreground text-sm">
      Color Mode:
    </div>
    <Select v-model="$colorMode.preference">
      <SelectTrigger>
        <SelectValue class="w-[8rem]" >
          {{ formatedColorMode }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            Color Mode
          </SelectLabel>
          <SelectItem value="system">
            System
          </SelectItem>
          <SelectItem value="light">
            Light
          </SelectItem>
          <SelectItem value="dark">
            Dark
          </SelectItem>
          <SelectItem value="sepia">
            Sepia
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
