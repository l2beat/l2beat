import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ProjectJSON, Section } from './types';

interface FormProps {
  data: ProjectJSON;
  setData: (data: ProjectJSON) => void;
}

export function Form({ data, setData }: FormProps) {
  const [sections, setSections] = useState<Section[]>(data.sections || []);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<'BASIC_INFO' | 'BADGES' | 'DISCOVERY' | ''>('');
  const [isAddingBadge, setIsAddingBadge] = useState<number | null>(null);

  const sectionTypes = [
    { label: 'Basic Info', value: 'BASIC_INFO' },
    { label: 'Badges', value: 'BADGES' },
    { label: 'Discovery', value: 'DISCOVERY' },
  ];

  const availableBadges = ['EVM', 'WasmVM', 'ZK-Rollup', 'Optimistic Rollup'];

  const handleAddSection = () => {
    if (!newSectionType) return;

    let newSection: Section;
    if (newSectionType === 'BASIC_INFO') {
      newSection = { type: 'BASIC_INFO', name: '', slug: '' };
    } else if (newSectionType === 'BADGES') {
      newSection = { type: 'BADGES', badges: [] };
    } else {
      newSection = { type: 'DISCOVERY', url: '' };
    }

    setSections([...sections, newSection]);
    setNewSectionType('');
    setIsAddingSection(false);
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
    <motion.div
      className="p-6 space-y-6 bg-gray-900 text-gray-300 rounded-lg shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-purple-400 uppercase">L2BEAT CMS</h2>
        <motion.button
          className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
          onClick={saveData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </div>

      {/* Dynamic Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="border rounded-lg p-4 bg-gray-800 shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h3 className="font-semibold text-gray-300 uppercase text-sm mb-4">
              {section.type}
            </h3>

            {section.type === 'BADGES' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {section.badges.map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      className="bg-gray-700 px-4 py-1 rounded-full text-sm font-medium text-gray-200 shadow-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                {isAddingBadge === index ? (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                      Select Badge
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                      onChange={(e) => {
                        const selectedBadge = e.target.value;
                        if (selectedBadge && !section.badges.includes(selectedBadge)) {
                          const updatedBadges = [...section.badges, selectedBadge];
                          updateSection(index, { ...section, badges: updatedBadges });
                        }
                        setIsAddingBadge(null);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a badge
                      </option>
                      {availableBadges.map((badge) => (
                        <option key={badge} value={badge}>
                          {badge}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      className="mt-4 bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 shadow-sm hover:bg-gray-600 focus:outline-none"
                      onClick={() => setIsAddingBadge(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                    onClick={() => setIsAddingBadge(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Badge
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Section Dropdown */}
      <div className="space-y-4">
        {!isAddingSection && (
          <motion.button
            className="w-full bg-gray-700 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 shadow-md hover:bg-gray-600 focus:outline-none"
            onClick={() => setIsAddingSection(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Section
          </motion.button>
        )}

        {isAddingSection && (
          <motion.div
            className="w-full bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
              Select Section Type
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as 'BASIC_INFO' | 'BADGES' | 'DISCOVERY')}
            >
              <option value="" disabled>
                Choose a type
              </option>
              {sectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4 gap-2">
              <motion.button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                onClick={handleAddSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
              <motion.button
                className="bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 shadow-sm hover:bg-gray-600 focus:outline-none"
                onClick={() => setIsAddingSection(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
