'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { POSITIONS, KIT_SIZES } from '@/lib/constants';

interface Player {
  id: string;
  name: string;
  position: string;
  number: string;
  kitSize: string;
}

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Ahmed Al Maktoum', position: 'GK', number: '1', kitSize: 'L' },
  { id: '2', name: 'Omar Hassan', position: 'DEF', number: '4', kitSize: 'M' },
  { id: '3', name: 'Khalid Bin Rashid', position: 'FWD', number: '9', kitSize: 'L' },
];

const MAX_PLAYERS = 8;

export default function RosterPage() {
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [showForm, setShowForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', number: '' });

  const addPlayer = () => {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) return;
    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newPlayer.name,
        position: newPlayer.position,
        number: newPlayer.number,
        kitSize: '',
      },
    ]);
    setNewPlayer({ name: '', position: '', number: '' });
    setShowForm(false);
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const updateKitSize = (id: string, size: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, kitSize: size } : p))
    );
  };

  const positionColors: Record<string, string> = {
    GK: 'bg-yellow-500/20 text-yellow-400',
    DEF: 'bg-blue-500/20 text-blue-400',
    MID: 'bg-green-500/20 text-green-400',
    FWD: 'bg-red-500/20 text-red-400',
  };

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Squad Roster</h1>
            <p className="text-sm text-text-muted mt-1">
              {players.length}/{MAX_PLAYERS}
            </p>
          </div>
          {players.length < MAX_PLAYERS && (
            <Button
              className="bg-tcl-red hover:bg-tcl-red/90 text-white text-sm"
              onClick={() => setShowForm(true)}
            >
              + Add Player
            </Button>
          )}
        </div>

        {/* Add Player Form */}
        {showForm && (
          <Card className="bg-bg-surface border-border-default p-4 space-y-3">
            <h3 className="text-sm font-medium text-text-primary">Add New Player</h3>
            <Input
              placeholder="Player name"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer((p) => ({ ...p, name: e.target.value }))}
            />
            <select
              className="w-full rounded-lg bg-bg-elevated border border-border-default px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tcl-red"
              value={newPlayer.position}
              onChange={(e) => setNewPlayer((p) => ({ ...p, position: e.target.value }))}
            >
              <option value="">Select position</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Jersey number"
              value={newPlayer.number}
              onChange={(e) => setNewPlayer((p) => ({ ...p, number: e.target.value }))}
              min={1}
              max={99}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-tcl-red hover:bg-tcl-red/90 text-white text-sm"
                onClick={addPlayer}
              >
                Add
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border-default text-text-secondary text-sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Player List */}
        <div className="space-y-2">
          {players.map((player) => (
            <Card key={player.id} className="bg-bg-surface border-border-default p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono text-text-muted w-8 text-center">
                    #{player.number}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{player.name}</p>
                    <Badge className={`text-xs mt-1 ${positionColors[player.position] || ''}`}>
                      {player.position}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md bg-bg-elevated border border-border-default px-2 py-1 text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-tcl-red"
                    value={player.kitSize}
                    onChange={(e) => updateKitSize(player.id, e.target.value)}
                  >
                    <option value="">Size</option>
                    {KIT_SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="h-7 w-7 rounded-md bg-bg-elevated hover:bg-red-500/20 flex items-center justify-center text-text-muted hover:text-error transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lock deadline notice */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-3 flex items-start gap-2">
          <svg className="h-4 w-4 text-warning mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-xs text-text-secondary">
            Roster locks 48 hours before the event
          </p>
        </div>

        {/* Save button */}
        <Button className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white">
          Save Roster
        </Button>
      </div>
    </PageContainer>
  );
}
