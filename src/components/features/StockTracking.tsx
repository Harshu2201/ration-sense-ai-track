
import { ShopSelector } from "./stock-tracking/ShopSelector";
import { WeatherSupplyRisk } from "./stock-tracking/WeatherSupplyRisk";
import { StockItemCard } from "./stock-tracking/StockItemCard";
import { useStockTracking } from "./stock-tracking/hooks";

export const StockTracking = () => {
  const {
    selectedShop,
    setSelectedShop,
    stockData,
    weatherData
  } = useStockTracking();

  return (
    <div className="space-y-6">
      <ShopSelector 
        selectedShop={selectedShop}
        onShopChange={setSelectedShop}
      />

      {weatherData && (
        <WeatherSupplyRisk weatherData={weatherData} />
      )}

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Current Stock Status</h3>
        {stockData.map((item, index) => (
          <StockItemCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
