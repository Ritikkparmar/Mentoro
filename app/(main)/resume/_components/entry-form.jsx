"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export function EntryForm({ type, entries = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!formData.title.trim()) {
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      ...formData,
    };

    onChange([...(entries || []), newEntry]);
    resetForm();
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setFormData({
      title: entry.title || "",
      organization: entry.organization || "",
      location: entry.location || "",
      startDate: entry.startDate || "",
      endDate: entry.endDate || "",
      description: entry.description || "",
    });
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!formData.title.trim()) {
      return;
    }

    const updatedEntries = [...(entries || [])];
    updatedEntries[editingIndex] = {
      ...updatedEntries[editingIndex],
      ...formData,
    };

    onChange(updatedEntries);
    resetForm();
  };

  const handleDelete = (index) => {
    const updatedEntries = (entries || []).filter((_, i) => i !== index);
    onChange(updatedEntries);
  };

  const getFieldLabel = (field) => {
    const labels = {
      Experience: {
        title: "Job Title",
        organization: "Company",
        location: "Location",
      },
      Education: {
        title: "Degree",
        organization: "Institution",
        location: "Location",
      },
      Project: {
        title: "Project Name",
        organization: "Organization/Client",
        location: "Location",
      },
    };
    return labels[type]?.[field] || field;
  };

  return (
    <div className="space-y-4">
      {/* Existing Entries */}
      {entries && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <Card key={entry.id || index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    {entry.organization && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.organization}
                        {entry.location && ` • ${entry.location}`}
                      </p>
                    )}
                    {(entry.startDate || entry.endDate) && (
                      <p className="text-sm text-muted-foreground">
                        {entry.startDate} {entry.endDate && `- ${entry.endDate}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {entry.description && (
                <CardContent className="pt-0">
                  <p className="text-sm whitespace-pre-line">{entry.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingIndex !== null) && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingIndex !== null ? `Edit ${type}` : `Add ${type}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {getFieldLabel("title")} *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={`Enter ${getFieldLabel("title").toLowerCase()}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {getFieldLabel("organization")}
                </label>
                <Input
                  value={formData.organization}
                  onChange={(e) =>
                    handleInputChange("organization", e.target.value)
                  }
                  placeholder={`Enter ${getFieldLabel("organization").toLowerCase()}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  placeholder="e.g., Jan 2020"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  placeholder="e.g., Dec 2022 or Present"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your responsibilities, achievements, or key points..."
                className="h-32"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                disabled={!formData.title.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Button */}
      {!isAdding && editingIndex === null && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}