import React from "react";
import { Card } from "./Card";
import { getEnabledWidgets, generateEmbedUrl } from "../config/widgets";

interface DynamicCardsProps {
  host: string;
}

export const DynamicCards: React.FC<DynamicCardsProps> = ({ host }) => {
  const widgets = getEnabledWidgets();

  return (
    <>
      {widgets.map((widget) => {
        const WidgetComponent = widget.component;
        const embedUrl = generateEmbedUrl(host, widget.pagePath);

        return (
          <Card
            key={widget.id}
            description={widget.description}
            buttonText={widget.buttonText || "Copy Embed Link"}
            embedUrl={embedUrl}
          >
            <WidgetComponent />
          </Card>
        );
      })}
    </>
  );
};
