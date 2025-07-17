import { CurrencyConverter } from "../widgets/CurrencyConverter";

// Widget 配置接口
export interface WidgetConfig {
  id: string; // 唯一标识符
  name: string; // 显示名称
  description: string; // 描述文字
  component: React.ComponentType; // React 组件
  pagePath: string; // 页面路径 (不包含.tsx后缀)
  buttonText?: string; // 按钮文字
  maxWidth?: string; // 最大宽度
  enabled?: boolean; // 是否启用
}

// 所有可用的 widgets 配置
export const WIDGETS_CONFIG: WidgetConfig[] = [
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "A simple, embeddable currency converter",
    component: CurrencyConverter,
    pagePath: "exchange",
    buttonText: "Copy Embed Link",
    maxWidth: "420px",
    enabled: true,
  },
  // 未来添加更多 widgets 只需在这里配置
  // {
  //   id: "calculator",
  //   name: "Calculator",
  //   description: "A simple calculator widget",
  //   component: Calculator,
  //   pagePath: "calculator",
  //   buttonText: "Copy Embed Link",
  //   maxWidth: "350px",
  //   enabled: true,
  // },
];

// 获取所有启用的 widgets
export const getEnabledWidgets = (): WidgetConfig[] => {
  return WIDGETS_CONFIG.filter((widget) => widget.enabled !== false);
};

// 根据 pagePath 获取 widget 配置
export const getWidgetByPath = (path: string): WidgetConfig | undefined => {
  return WIDGETS_CONFIG.find((widget) => widget.pagePath === path);
};

// 生成 embedUrl
export const generateEmbedUrl = (host: string, pagePath: string): string => {
  return `${host}/${pagePath}`;
};
