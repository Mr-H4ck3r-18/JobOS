interface PipelineStage {
  label: string;
  value: number;
}

interface StatusPipelineProps {
  pipeline: PipelineStage[];
}

export function StatusPipeline({ pipeline }: StatusPipelineProps) {
  // Find max value to calculate percentage width, default to 1 if all 0 to avoid division by zero
  const maxValue = Math.max(...pipeline.map(s => s.value), 1);

  return (
    <div className="space-y-4">
      {pipeline.map((stage) => {
        const width = `${Math.round((stage.value / maxValue) * 100)}%`;
        
        return (
          <div key={stage.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stage.label}</span>
              <span className="font-mono text-sm text-foreground">{stage.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
