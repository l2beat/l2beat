import type { ProjectJSON, Section } from './types';
import { useState } from 'react';

interface FormProps {
  data: ProjectJSON;
  setData: (data: ProjectJSON) => void;
}

export function Form({ data, setData }: FormProps) {
  const [sections, setSections] = useState<Section[]>(data.sections || []);

  const addSection = () => {
    const sectionType = prompt(
      'Enter section type (BASIC_INFO, BADGES, DISCOVERY):'
    ) as 'BASIC_INFO' | 'BADGES' | 'DISCOVERY';

    if (!['BASIC_INFO', 'BADGES', 'DISCOVERY'].includes(sectionType)) {
      alert('Invalid section type!');
      return;
    }

    // Create new section based on the type
    let newSection: Section;
    if (sectionType === 'BASIC_INFO') {
      newSection = { type: 'BASIC_INFO', name: '', slug: '' };
    } else if (sectionType === 'BADGES') {
      newSection = { type: 'BADGES', badges: [] };
    } else if (sectionType === 'DISCOVERY') {
      newSection = { type: 'DISCOVERY', url: '' };
    } else {
      // This should never happen due to the earlier validation
      return;
    }

    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? updatedSection : section
    );
    setSections(updatedSections);
  };

  const saveData = () => {
    setData({ sections });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Form</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={saveData}
        >
          Save
        </button>
      </div>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <div key={index} className="border p-4 rounded space-y-4">
          <h3 className="font-semibold text-gray-700">{section.type}</h3>
          {section.type === 'BASIC_INFO' && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) =>
                    updateSection(index, { ...section, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  value={section.slug}
                  onChange={(e) =>
                    updateSection(index, { ...section, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
          )}
          {section.type === 'BADGES' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {section.badges.map((badge, badgeIndex) => (
                  <span
                    key={badgeIndex}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <button
                className="bg-gray-100 px-4 py-2 rounded border text-sm hover:bg-gray-200"
                onClick={() => {
                  const newBadge = prompt('Enter badge name:');
                  if (newBadge) {
                    const updatedBadges = [...section.badges, newBadge];
                    updateSection(index, { ...section, badges: updatedBadges });
                  }
                }}
              >
                Add Badge
              </button>
            </div>
          )}
          {section.type === 'DISCOVERY' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="text"
                value={section.url}
                onChange={(e) =>
                  updateSection(index, { ...section, url: e.target.value })
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          )}
        </div>
      ))}

      {/* Add Section Button */}
      <button
        className="w-full bg-gray-100 px-4 py-2 rounded border text-sm hover:bg-gray-200"
        onClick={addSection}
      >
        Add Section
      </button>
    </div>
  );
}
