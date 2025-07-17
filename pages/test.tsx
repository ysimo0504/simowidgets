import { WidgetPageLayout } from "../components/WidgetPageLayout";
import { TestWidget } from "../widgets/TestWidget";
// import { getWidgetByPath } from "../config/widgets";

export default function Test() {
  //   const widgetConfig = getWidgetByPath("test");
  // const WidgetComponent = widgetConfig.component;
  return (
    <WidgetPageLayout>
      <TestWidget />
    </WidgetPageLayout>
  );
}
