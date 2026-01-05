
// Define marker positions for different tooth models
export const getMarkersByType = (modelType: string) => {
  switch (modelType) {
    case 'molar':
      return [
        { position: [0, 1.5, 0] as [number, number, number], label: 'Crown', color: '#4caf50' },
        { position: [0, -1.5, 0] as [number, number, number], label: 'Root', color: '#ff9800' },
        { position: [0, 0.8, 0.8] as [number, number, number], label: 'Enamel', color: '#2196f3' },
      ];
    case 'implant':
      return [
        { position: [0, 1.5, 0] as [number, number, number], label: 'Abutment', color: '#9c27b0' },
        { position: [0, 0, 0] as [number, number, number], label: 'Fixture', color: '#f44336' },
        { position: [0, -1.5, 0] as [number, number, number], label: 'Screw', color: '#607d8b' },
      ];
    default:
      return [];
  }
};

// Model descriptions for each type
export const modelDescriptions = {
  fullMouth: "Complete dental arch showing all teeth in their natural position. Observe the alignment and spacing of teeth in a healthy mouth.",
  molar: "Back teeth used for grinding food with multiple cusps and roots. Molars handle most of your chewing and grinding of food.",
  incisor: "Front teeth with a sharp biting edge for cutting food. Incisors are usually the first teeth to erupt in both babies and adults.",
  implant: "Titanium post surgical implant that replaces tooth roots with a crown attachment. Dental implants provide a strong foundation for fixed or removable replacement teeth.",
};
