import { SINGULAR_ANALYTICS_ENDPOINTS } from "@/lib/analytics/constants";
import { DeviceTabs } from "@/lib/analytics/types";
import { useRouterStuff } from "@dub/ui";
import { useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { AnalyticsLoadingSpinner } from "./analytics-loading-spinner";
import BarList from "./bar-list";
import DeviceIcon from "./device-icon";
import { useAnalyticsFilterOption } from "./utils";

export default function Devices() {
  const { queryParams } = useRouterStuff();

  const [tab, setTab] = useState<DeviceTabs>("devices");
  const data = useAnalyticsFilterOption(tab);
  const singularTabName = SINGULAR_ANALYTICS_ENDPOINTS[tab];

  return (
    <AnalyticsCard
      tabs={[
        { id: "devices", label: "Devices" },
        { id: "browsers", label: "Browsers" },
        { id: "os", label: "OS" },
      ]}
      selectedTabId={tab}
      onSelectTab={setTab}
      expandLimit={8}
      hasMore={(data?.length ?? 0) > 8}
    >
      {({ limit, event, setShowModal }) =>
        data ? (
          data.length > 0 ? (
            <BarList
              tab={singularTabName}
              data={
                data?.map((d) => ({
                  icon: (
                    <DeviceIcon
                      display={d[singularTabName]}
                      tab={tab}
                      className="h-4 w-4"
                    />
                  ),
                  title: d[singularTabName],
                  href: queryParams({
                    set: {
                      [singularTabName]: d[singularTabName],
                    },
                    getNewPath: true,
                  }) as string,
                  value: d[event] || 0,
                })) || []
              }
              maxValue={(data && data[0]?.[event]) || 0}
              barBackground="bg-green-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent hover:border-green-500"
              setShowModal={setShowModal}
              {...(limit && { limit })}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-gray-600">No data available</p>
            </div>
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <AnalyticsLoadingSpinner />
          </div>
        )
      }
    </AnalyticsCard>
  );
}
