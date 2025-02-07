import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ProjectJSON, Section } from './types';

// Define the keys used in a LINKS section.
type LinkCategory = 'websites' | 'apps' | 'documentation' | 'explorers' | 'repositories' | 'socialMedia' | 'rollupCodes';

// Define the Milestone type.
interface Milestone {
  title: string;
  url: string;
  date: string;
  type: string;
  description?: string;
}

interface FormProps {
  data: ProjectJSON;
  setData: (data: ProjectJSON) => void;
}

export function Form({ data, setData }: FormProps) {
  const [sections, setSections] = useState<Section[]>(data.sections || []);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<
    'BASIC_INFO' | 'BADGES' | 'DISCOVERY' | 'LINKS' | 'MILESTONES' | ''
  >('');
  const [isAddingBadge, setIsAddingBadge] = useState<number | null>(null);

  // Global state for adding a new link in a LINKS section.
  const [addingLink, setAddingLink] = useState<{ sectionIndex: number; category: LinkCategory; value: string } | null>(null);

  // Global state for adding a new milestone in a MILESTONES section.
  const [addingMilestone, setAddingMilestone] = useState<{ sectionIndex: number; milestone: Milestone } | null>(null);

  const sectionTypes = [
    { label: 'Basic Info', value: 'BASIC_INFO' },
    { label: 'Badges', value: 'BADGES' },
    { label: 'Discovery', value: 'DISCOVERY' },
    { label: 'Links', value: 'LINKS' },
    { label: 'Milestones', value: 'MILESTONES' },
  ];

  const availableBadges = ['EVM', 'WasmVM', 'ZK-Rollup', 'Optimistic Rollup'];

  const handleAddSection = () => {
    if (!newSectionType) return;

    let newSection: Section;
    if (newSectionType === 'BASIC_INFO') {
      newSection = { type: 'BASIC_INFO', name: '', slug: '' };
    } else if (newSectionType === 'BADGES') {
      newSection = { type: 'BADGES', badges: [] };
    } else if (newSectionType === 'DISCOVERY') {
      newSection = { type: 'DISCOVERY', url: '' };
    } else if (newSectionType === 'LINKS') {
      newSection = {
        type: 'LINKS',
        links: {
          websites: [],
          apps: [],
          documentation: [],
          explorers: [],
          repositories: [],
          socialMedia: [],
          rollupCodes: [],
        },
      };
    } else if (newSectionType === 'MILESTONES') {
      newSection = {
        type: 'MILESTONES',
        milestones: [],
      };
    } else {
      return;
    }

    setSections([...sections, newSection]);
    setNewSectionType('');
    setIsAddingSection(false);
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const updatedSections = sections.map((section, i) => (i === index ? updatedSection : section));
    setSections(updatedSections);
  };

  const saveData = () => {
    setData({ sections });
  };

  // Remove a link from a LINKS section.
  const removeLink = (sectionIndex: number, category: LinkCategory, link: string) => {
    const section = sections[sectionIndex];
    if (section.type !== 'LINKS') return;
    const updatedLinks = section.links[category].filter((l: string) => l !== link);
    updateSection(sectionIndex, {
      ...section,
      links: { ...section.links, [category]: updatedLinks },
    });
  };

  // Milestone helper functions.
  const updateMilestone = (sectionIndex: number, milestoneIndex: number, updatedMilestone: Milestone) => {
    const section = sections[sectionIndex];
    if (section.type !== 'MILESTONES') return;
    const updatedMilestones = section.milestones.map((m: Milestone, i: number) =>
      i === milestoneIndex ? updatedMilestone : m
    );
    updateSection(sectionIndex, { ...section, milestones: updatedMilestones });
  };

  const removeMilestone = (sectionIndex: number, milestoneIndex: number) => {
    const section = sections[sectionIndex];
    if (section.type !== 'MILESTONES') return;
    const updatedMilestones = section.milestones.filter((_: Milestone, i: number) => i !== milestoneIndex);
    updateSection(sectionIndex, { ...section, milestones: updatedMilestones });
  };

  // Define link categories (all treated as arrays).
  const linkCategoryFields: { key: LinkCategory; label: string }[] = [
    { key: 'websites', label: 'Websites' },
    { key: 'apps', label: 'Apps' },
    { key: 'documentation', label: 'Documentation' },
    { key: 'explorers', label: 'Explorers' },
    { key: 'repositories', label: 'Repositories' },
    { key: 'socialMedia', label: 'Social Media' },
    { key: 'rollupCodes', label: 'Rollup Codes' },
  ];

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
            <h3 className="font-semibold text-gray-300 uppercase text-sm mb-4">{section.type}</h3>

            {/* BASIC_INFO Section */}
            {section.type === 'BASIC_INFO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Name</label>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSection(index, { ...section, name: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Slug</label>
                  <input
                    type="text"
                    value={section.slug}
                    onChange={(e) => updateSection(index, { ...section, slug: e.target.value })}
                    placeholder="Enter project slug"
                    className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* BADGES Section */}
            {section.type === 'BADGES' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {section.badges.map((badge, badgeIndex) => (
                    <span key={badgeIndex} className="bg-gray-700 px-4 py-1 rounded-full text-sm font-medium text-gray-200 shadow-sm">
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
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Select Badge</label>
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

            {/* DISCOVERY Section */}
            {section.type === 'DISCOVERY' && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">URL</label>
                <input
                  type="text"
                  value={section.url}
                  onChange={(e) => updateSection(index, { ...section, url: e.target.value })}
                  placeholder="Enter URL"
                  className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                />
              </div>
            )}

            {/* LINKS Section */}
            {section.type === 'LINKS' && (
              <div className="space-y-4">
                {linkCategoryFields
                  .filter(field => section.links[field.key] && section.links[field.key].length > 0)
                  .map(field => (
                    <div key={field.key} className="border p-2 rounded-md bg-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{field.label}:</span>
                      </div>
                      <ul className="mt-2">
                        {section.links[field.key].map((link: string, linkIndex: number) => (
                          <li key={linkIndex} className="flex items-center justify-between bg-gray-800 p-1 rounded">
                            <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                              {link}
                            </a>
                            <button className="text-xs text-red-400 hover:underline" onClick={() => removeLink(index, field.key, link)}>
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                <div className="mt-4 border p-4 rounded-md bg-gray-800">
                  {(!addingLink || addingLink.sectionIndex !== index) ? (
                    <button
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
                      onClick={() => setAddingLink({ sectionIndex: index, category: '' as LinkCategory, value: '' })}
                    >
                      Add New Link
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <select
                        className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg"
                        value={addingLink.category}
                        onChange={(e) => setAddingLink({ ...addingLink, category: e.target.value as LinkCategory })}
                      >
                        <option value="" disabled>
                          Select Link Category
                        </option>
                        {linkCategoryFields.map((field) => (
                          <option key={field.key} value={field.key}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={addingLink.value}
                        onChange={(e) => setAddingLink({ ...addingLink, value: e.target.value })}
                        placeholder="Enter URL"
                        className="w-full px-4 py-2 bg-gray-600 text-gray-200 border border-gray-500 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => {
                            if (addingLink.category && addingLink.value.trim() !== '') {
                              const updatedLinks = [
                                ...section.links[addingLink.category],
                                addingLink.value.trim(),
                              ];
                              updateSection(index, {
                                ...section,
                                links: { ...section.links, [addingLink.category]: updatedLinks },
                              });
                              setAddingLink(null);
                            }
                          }}
                        >
                          Confirm
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg" onClick={() => setAddingLink(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MILESTONES Section */}
            {section.type === 'MILESTONES' && (
              <div className="space-y-4">
                {section.milestones.map((milestone: Milestone, mIndex: number) => (
                  <div key={mIndex} className="border p-2 rounded-md bg-gray-700 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Title</label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, mIndex, { ...milestone, title: e.target.value })}
                        placeholder="Milestone title"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">URL</label>
                      <input
                        type="text"
                        value={milestone.url}
                        onChange={(e) => updateMilestone(index, mIndex, { ...milestone, url: e.target.value })}
                        placeholder="Milestone URL"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Date</label>
                      <input
                        type="text"
                        value={milestone.date}
                        onChange={(e) => updateMilestone(index, mIndex, { ...milestone, date: e.target.value })}
                        placeholder="2024 Oct 25th"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Type</label>
                      <input
                        type="text"
                        value={milestone.type}
                        onChange={(e) => updateMilestone(index, mIndex, { ...milestone, type: e.target.value })}
                        placeholder="Milestone type"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Description</label>
                      <textarea
                        value={milestone.description || ''}
                        onChange={(e) => updateMilestone(index, mIndex, { ...milestone, description: e.target.value })}
                        placeholder="Milestone description (optional)"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                    </div>
                    <button
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => removeMilestone(index, mIndex)}
                    >
                      Remove Milestone
                    </button>
                  </div>
                ))}

                {/* Global control for adding a new milestone */}
                <div className="mt-4 border p-4 rounded-md bg-gray-800">
                  {(!addingMilestone || addingMilestone.sectionIndex !== index) ? (
                    <button
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
                      onClick={() =>
                        setAddingMilestone({
                          sectionIndex: index,
                          milestone: { title: '', url: '', date: '', type: '', description: '' },
                        })
                      }
                    >
                      Add New Milestone
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={addingMilestone.milestone.title}
                        onChange={(e) =>
                          setAddingMilestone({
                            ...addingMilestone,
                            milestone: { ...addingMilestone.milestone, title: e.target.value },
                          })
                        }
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                      <input
                        type="text"
                        value={addingMilestone.milestone.url}
                        onChange={(e) =>
                          setAddingMilestone({
                            ...addingMilestone,
                            milestone: { ...addingMilestone.milestone, url: e.target.value },
                          })
                        }
                        placeholder="URL"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                      <input
                        type="text"
                        value={addingMilestone.milestone.date}
                        onChange={(e) =>
                          setAddingMilestone({
                            ...addingMilestone,
                            milestone: { ...addingMilestone.milestone, date: e.target.value },
                          })
                        }
                        placeholder="2024 Oct 25th"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                      <input
                        type="text"
                        value={addingMilestone.milestone.type}
                        onChange={(e) =>
                          setAddingMilestone({
                            ...addingMilestone,
                            milestone: { ...addingMilestone.milestone, type: e.target.value },
                          })
                        }
                        placeholder="Type"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                      <textarea
                        value={addingMilestone.milestone.description}
                        onChange={(e) =>
                          setAddingMilestone({
                            ...addingMilestone,
                            milestone: { ...addingMilestone.milestone, description: e.target.value },
                          })
                        }
                        placeholder="Description (optional)"
                        className="w-full px-2 py-1 bg-gray-600 text-gray-200 border border-gray-500 rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => {
                            if (
                              addingMilestone.milestone.title.trim() !== '' &&
                              addingMilestone.milestone.url.trim() !== '' &&
                              addingMilestone.milestone.date.trim() !== '' &&
                              addingMilestone.milestone.type.trim() !== ''
                            ) {
                              const section = sections[index];
                              if (section.type !== 'MILESTONES') return;
                              const updatedMilestones = [
                                ...section.milestones,
                                addingMilestone.milestone,
                              ];
                              updateSection(index, { ...section, milestones: updatedMilestones });
                              setAddingMilestone(null);
                            }
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => setAddingMilestone(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Select Section Type</label>
            <select
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
              value={newSectionType}
              onChange={(e) =>
                setNewSectionType(e.target.value as 'BASIC_INFO' | 'BADGES' | 'DISCOVERY' | 'LINKS' | 'MILESTONES' | '')
              }
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
