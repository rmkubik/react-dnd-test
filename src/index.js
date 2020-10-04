import ReactDOM from "react-dom";
import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  constructMatrixFromTemplate,
  getLocation,
  mapMatrix,
  updateMatrix,
} from "functional-game-utils";

const TILE_SIZE = 32;

const ItemTypes = {
  CARD: "CARD",
};

const parseMapTemplate = constructMatrixFromTemplate((char) => {
  switch (char) {
    case ".":
      return {};
    case "x":
      return { icon: "X", bgColor: "gray" };
    default:
      return {};
  }
});

function Draggable({ isDragging, children, location }) {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, location },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <div ref={dragRef} style={{ opacity }}>
      {children}
    </div>
  );
}

function Droppable({ children, onDrop }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={dropRef} style={{ backgroundColor: isOver ? "yellow" : "" }}>
      {children}
    </div>
  );
}

function Tile({ icon, bgColor, location, isOver, moveTile }) {
  const Wrapper = Boolean(icon) ? Draggable : Droppable;

  return (
    <Wrapper
      location={location}
      onDrop={(item, monitor) => {
        const oldLocation = item.location;
        const newLocation = location;

        moveTile(oldLocation, newLocation);
      }}
    >
      <div
        style={{
          backgroundColor: bgColor,
          width: `${TILE_SIZE}px`,
          height: `${TILE_SIZE}px`,
          border: "1px black solid",
        }}
      >
        {icon}
      </div>
    </Wrapper>
  );
}

function Grid({ tiles, renderTile }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${TILE_SIZE}px `.repeat(tiles.length),
      }}
    >
      {mapMatrix(renderTile, tiles)}
    </div>
  );
}

const App = () => {
  const [tiles, setTiles] = useState(
    parseMapTemplate(`
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . x . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
        . . . . . . . . . .
    `)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid
        tiles={tiles}
        renderTile={(tile, location) => (
          <Tile
            key={`${location.row}.${location.col}`}
            location={location}
            moveTile={(oldLocation, newLocation) => {
              const oldValue = getLocation(tiles, oldLocation);
              const newValue = getLocation(tiles, newLocation);
              const oneValueReplaced = updateMatrix(
                oldLocation,
                newValue,
                tiles
              );
              const bothValuesReplaced = updateMatrix(
                newLocation,
                oldValue,
                oneValueReplaced
              );

              setTiles(bothValuesReplaced);
            }}
            {...tile}
          />
        )}
      />
    </DndProvider>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
