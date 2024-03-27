import { useEffect, useRef, useState } from "react";
import CostChart from "./CostChart";
import FullView from "./FullView";
import ParseQueryPlan from "./ParseQueryPlan";
import RecombProcess from "./RecombProcess";
import JoinOrderTree from "./JoinOrderTree";
import { Card } from "@material-tailwind/react";

import "../../assets/stylesheets/Geqo.css";

const GeqoMain = () => {
  const chartRef = useRef(null);
  const [chartSize, setChartSize] = useState(0);

  const fullRef = useRef(null);
  const [fullSize, setFullSize] = useState(0);

  const indivRef = useRef(null);
  const [indivSize, setIndivSize] = useState(0);

  useEffect(() => {
    const updateSizes = () => {
      setChartSize(chartRef.current.offsetWidth);
      setFullSize(fullRef.current.offsetWidth);
      setIndivSize(indivRef.current.offsetWidth);
    };

    // initial size
    updateSizes();

    // update sizes on resize
    window.addEventListener("resize", updateSizes);

    // cleanup
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  return (
    <div className="flex gap-x-2">
      <div ref={chartRef} className="w-1/4 grid grid-cols-1 gap-2">
        <Card>
          <CostChart width={chartSize} height={chartSize} />
        </Card>
        <Card>
          <JoinOrderTree width={chartSize} height={chartSize} />
        </Card>
      </div>
      <div ref={fullRef} className="w-1/2">
        <FullView width={fullSize} height={fullSize} />
      </div>
      <div ref={indivRef} className="w-1/4 grid grid-cols-1 gap-2">
        <Card>
          <ParseQueryPlan width={indivSize} height={indivSize} />
        </Card>
        <Card>
          <RecombProcess width={indivSize} height={indivSize} />
        </Card>
      </div>
    </div>
  );
};

export default GeqoMain;