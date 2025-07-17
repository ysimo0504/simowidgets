"use client";
import { CurrencyConverter } from "../widgets/CurrencyConverter";
import { WidgetPageLayout } from "../components/WidgetPageLayout";

export default function Exchange() {
  return (
    <WidgetPageLayout>
      <CurrencyConverter />
    </WidgetPageLayout>
  );
}
