import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mapImg from "../assets/map.png";

export default function Map() {
  return (
  <div className="relative rounded-2xl overflow-hidden h-full w-full flex items-center justify-center"
  style={{ backgroundColor: "#EFEFEF" }}
  >
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              <button type="button" onClick={() => zoomIn()} className="px-2 py-1 bg-white rounded shadow">+</button>
              <button type="button" onClick={() => zoomOut()} className="px-2 py-1 bg-white rounded shadow">-</button>
              <button type="button" onClick={() => resetTransform()} className="px-2 py-1 bg-white rounded shadow">Reset</button>
            </div>
            <TransformComponent>
              <img src={mapImg} alt="Map" className="w-full h-full object-contain" style={{ display: 'block' }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}