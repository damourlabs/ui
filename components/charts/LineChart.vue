<template>
  <LineChart v-bind="props" />
</template>

<script setup lang="ts">
import { LineChart } from 'vue-chrts';

import type { LegendPosition, BulletLegendItemInterface, CurveType } from 'vue-chrts';

export type LineChartProps<T> = {
  categories: Record<string, BulletLegendItemInterface>;
  curveType?: CurveType;
  data: T[];
  height: number;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  legendPosition?: LegendPosition;
  minMaxTicksOnly?: boolean;
  xDomainLine?: boolean;
  xExplicitTicks?: number;
  xFormatter: (i: number, idx?: number) => string | number;
  xGridLine?: boolean;
  xLabel?: string;
  xNumTicks?: number;
  xTickLine?: boolean;
  yDomainLine?: boolean;
  yFormatter?: (i: number, idx?: number) => string;
  yGridLine?: boolean;
  yLabel?: string;
  yNumTicks?: number;
  yTickLine?: boolean;
};

const props = defineProps<LineChartProps<Record<string, number | string>>>();

// Ensure that the props are reactive and can be used in the template
const reactiveProps = reactive(props);
// This ensures that the props are reactive and can be used in the template
defineExpose({
  props: reactiveProps,
});
</script>
