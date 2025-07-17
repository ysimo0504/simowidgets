# Widgets for Notion

1. 创建 widget 组件
   ```ts
   // widgets/Calculator.tsx
   export const Calculator = () => {
     return <div>Calculator Widget</div>;
   };
   ```
2. 创建页面文件
   ```ts
   // pages/calculator.tsx
   export default function Calculator() {
     const widgetConfig = getWidgetByPath("calculator");
     const WidgetComponent = widgetConfig.component;
     return (
       <WidgetPageLayout>
         <WidgetComponent />
       </WidgetPageLayout>
     );
   }
   ```
3. 添加配置
   ```ts
   // config/widgets.ts 中添加
   {
     id: "calculator",
     name: "Calculator",
     description: "A simple calculator widget",
     component: Calculator,
     pagePath: "calculator",
     enabled: true,
   }
   ```
