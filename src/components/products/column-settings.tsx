"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Columns3, GripVertical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { REORDERABLE_COLUMNS } from "@/lib/constants";
import type { ColumnConfig, ProductColumnId } from "@/types/product";
import { cn } from "@/lib/utils";

interface ColumnSettingsProps {
  columns: ColumnConfig[];
  onToggle: (id: ProductColumnId) => void;
  onReorder: (activeId: ProductColumnId, overId: ProductColumnId) => void;
  onReset: () => void;
}

function SortableRow({
  col,
  onToggle,
}: {
  col: ColumnConfig;
  onToggle: (id: ProductColumnId) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-transparent px-2 py-2",
        isDragging && "border-border bg-muted/50 shadow-sm"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${col.label}`}
      >
        <GripVertical className="size-4" />
      </button>
      <Checkbox
        id={`col-${col.id}`}
        checked={col.visible}
        onCheckedChange={() => onToggle(col.id)}
      />
      <label htmlFor={`col-${col.id}`} className="flex-1 cursor-pointer text-sm">
        {col.label || "Actions"}
      </label>
    </div>
  );
}

export function ColumnSettings({ columns, onToggle, onReorder, onReset }: ColumnSettingsProps) {
  const reorderable = columns.filter((c) => REORDERABLE_COLUMNS.includes(c.id));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(active.id as ProductColumnId, over.id as ProductColumnId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Columns3 className="size-3.5" />
          Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize columns</DialogTitle>
          <DialogDescription>
            Show, hide, or drag to reorder. Preferences are saved locally.
          </DialogDescription>
        </DialogHeader>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={reorderable.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0.5">
              {reorderable.map((col) => (
                <SortableRow key={col.id} col={col} onToggle={onToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button variant="ghost" size="sm" className="mt-2 gap-2" onClick={onReset}>
          <RotateCcw className="size-3.5" />
          Reset to default
        </Button>
      </DialogContent>
    </Dialog>
  );
}
