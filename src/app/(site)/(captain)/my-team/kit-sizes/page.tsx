'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KIT_SIZES } from '@/lib/constants';

interface PlayerSize {
  id: string;
  name: string;
  kitSize: string;
}

const MOCK_ROSTER: PlayerSize[] = [
  { id: '1', name: 'Ahmed Al Maktoum', kitSize: 'L' },
  { id: '2', name: 'Omar Hassan', kitSize: 'M' },
  { id: '3', name: 'Khalid Bin Rashid', kitSize: 'L' },
  { id: '4', name: 'Saeed Al Ameri', kitSize: '' },
  { id: '5', name: 'Hamad Al Falasi', kitSize: '' },
  { id: '6', name: 'Rashid Al Nuaimi', kitSize: '' },
  { id: '7', name: 'Sultan Al Ketbi', kitSize: '' },
  { id: '8', name: 'Faisal Al Suwaidi', kitSize: '' },
];

export default function KitSizesPage() {
  const [roster, setRoster] = useState<PlayerSize[]>(MOCK_ROSTER);

  const updateSize = (id: string, size: string) => {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, kitSize: size } : p))
    );
  };

  const selectedCount = roster.filter((p) => p.kitSize).length;

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Kit Sizes</h1>
          <p className="text-sm text-text-muted mt-1">
            {selectedCount} of {roster.length} sizes selected
          </p>
        </div>

        {/* Completion indicator */}
        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-tcl-red rounded-full transition-all duration-300"
            style={{ width: `${(selectedCount / roster.length) * 100}%` }}
          />
        </div>

        {/* Player List */}
        <div className="space-y-2">
          {roster.map((player) => (
            <Card key={player.id} className="bg-bg-surface border-border-default p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-text-primary flex-1">
                  {player.name}
                </span>
                <div className="flex gap-1">
                  {KIT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSize(player.id, size)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        player.kitSize === size
                          ? 'bg-tcl-red text-white'
                          : 'bg-bg-elevated text-text-muted hover:text-text-secondary border border-border-default'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Submit button */}
        <Button
          className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white"
          disabled={selectedCount < roster.length}
        >
          {selectedCount < roster.length
            ? `Select ${roster.length - selectedCount} more sizes`
            : 'Submit Sizes'}
        </Button>
      </div>
    </PageContainer>
  );
}
