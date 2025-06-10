<template>
  <BarChart v-bind="props" />
</template>

<script setup lang="ts">

import { BarChart } from 'vue-chrts';
import type { LegendPosition, Orientation, BulletLegendItemInterface } from 'vue-chrts';

export type BarChartProps<T> = {
  barPadding?: number;
  categories: Record<string, BulletLegendItemInterface>
  data: T[];
  groupPadding?: number;
  height: number;
  hideLegend?: boolean;
  legendPosition?: LegendPosition;
  minMaxTicksOnly?: boolean;
  orientation?: Orientation
  radius?: number;
  stacked?: boolean;
  xDomainLine: boolean;
  xExplicitTicks?: number;
  xFormatter: (i: number, idx?: number) => string | number;
  xGridLine?: boolean;
  xLabel?: string;
  xNumTicks?: number;
  xTickLine?: boolean;
  yAxis: (keyof T)[];
  yDomainLine: boolean;
  yFormatter?: (i: number, idx?: number) => string | number;
  yGridLine?: boolean;
  yLabel?: string;
  yNumTicks?: number;
  yTickLine?: boolean;
};



const props = defineProps<BarChartProps<Record<string, number | string>>>();

// Ensure that the props are reactive and can be used in the template
const reactiveProps = reactive(props);
// This ensures that the props are reactive and can be used in the template
defineExpose({
  props: reactiveProps,
});

</script>
