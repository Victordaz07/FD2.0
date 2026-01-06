/**
 * Component Showcase
 * Visual demonstration of all design system components
 * Use this as a reference for component variants and states
 */

import { useState } from "react";
import { Plus, Mail, Search, Check, X } from "lucide-react";
import {
  Button,
  Card,
  Badge,
  ProgressBar,
  Input,
  Select,
  Toggle,
  Tabs,
  Modal,
} from "../components/ds";

export function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", badge: 12 },
    { id: "active", label: "Active", badge: 5 },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-screen-md mx-auto px-5 py-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Component Showcase</h1>
          <p className="text-sm text-neutral-500 mt-1">Design System Components Library</p>
        </div>
      </div>

      <main className="max-w-screen-md mx-auto px-5 py-6 space-y-8">
        {/* Buttons */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Buttons</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">With Icons</p>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<Plus className="w-4 h-4" />}>Add Item</Button>
                <Button variant="outline" rightIcon={<Check className="w-4 h-4" />}>
                  Complete
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">States</p>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cards</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Card variant="default" padding="md">
              <p className="text-sm font-medium text-neutral-900 mb-1">Default</p>
              <p className="text-xs text-neutral-500">Border + shadow</p>
            </Card>
            
            <Card variant="elevated" padding="md">
              <p className="text-sm font-medium text-neutral-900 mb-1">Elevated</p>
              <p className="text-xs text-neutral-500">Shadow only</p>
            </Card>
            
            <Card variant="outlined" padding="md">
              <p className="text-sm font-medium text-neutral-900 mb-1">Outlined</p>
              <p className="text-xs text-neutral-500">Border only</p>
            </Card>
            
            <Card variant="ghost" padding="md">
              <p className="text-sm font-medium text-neutral-900 mb-1">Ghost</p>
              <p className="text-xs text-neutral-500">Subtle bg</p>
            </Card>
          </div>

          <div className="mt-4">
            <Card variant="default" padding="md" pressable>
              <p className="text-sm font-medium text-neutral-900 mb-1">Pressable Card</p>
              <p className="text-xs text-neutral-500">Click me!</p>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Badges</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">With Dot</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="error" dot>Offline</Badge>
                <Badge variant="warning" dot>Pending</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bars */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Progress Bars</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">Variants</p>
              <div className="space-y-3">
                <ProgressBar value={35} variant="primary" />
                <ProgressBar value={65} variant="success" />
                <ProgressBar value={50} variant="warning" />
                <ProgressBar value={80} variant="error" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">With Label</p>
              <ProgressBar value={75} variant="primary" showLabel />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">Sizes</p>
              <div className="space-y-3">
                <ProgressBar value={60} size="sm" />
                <ProgressBar value={60} size="md" />
                <ProgressBar value={60} size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Inputs</h2>
          
          <div className="space-y-4">
            <Input 
              label="Email"
              placeholder="Enter your email"
              size="md"
            />

            <Input 
              label="Search"
              placeholder="Search..."
              leftIcon={<Search className="w-5 h-5" />}
            />

            <Input 
              label="Password"
              type="password"
              rightIcon={<X className="w-5 h-5" />}
            />

            <Input 
              label="Error State"
              state="error"
              helperText="This field is required"
              value="invalid@"
            />

            <Input 
              label="Success State"
              state="success"
              helperText="Email is valid"
              value="user@example.com"
            />

            <Input 
              label="Disabled"
              disabled
              value="Disabled input"
            />
          </div>
        </section>

        {/* Select */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Select</h2>
          
          <div className="space-y-4">
            <Select label="Priority" size="md">
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>

            <Select 
              label="Category" 
              helperText="Choose a category"
            >
              <option value="">Select category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="family">Family</option>
            </Select>

            <Select 
              label="Error State"
              error
              helperText="Please select an option"
            >
              <option value="">Select...</option>
            </Select>
          </div>
        </section>

        {/* Toggle */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Toggle</h2>
          
          <Card variant="default" padding="md">
            <div className="space-y-4">
              <Toggle
                label="Push Notifications"
                description="Receive push notifications for new messages"
                checked={toggleValue}
                onChange={(e) => setToggleValue(e.target.checked)}
              />

              <Toggle
                label="Email Notifications"
                checked={false}
              />

              <Toggle
                label="Disabled Toggle"
                disabled
                checked={true}
              />

              <div className="flex gap-4">
                <Toggle size="sm" checked={true} />
                <Toggle size="md" checked={true} />
                <Toggle size="lg" checked={true} />
              </div>
            </div>
          </Card>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Tabs</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">Default Variant</p>
              <Tabs
                tabs={tabs}
                activeId={activeTab}
                onTabChange={setActiveTab}
                variant="default"
                fullWidth
              />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">Pills Variant</p>
              <Tabs
                tabs={tabs}
                activeId={activeTab}
                onTabChange={setActiveTab}
                variant="pills"
                fullWidth
              />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-3">Underline Variant</p>
              <Tabs
                tabs={tabs}
                activeId={activeTab}
                onTabChange={setActiveTab}
                variant="underline"
                fullWidth
              />
            </div>
          </div>
        </section>

        {/* Modal Trigger */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Modal</h2>
          
          <Button onClick={() => setShowModal(true)}>
            Open Modal
          </Button>
        </section>
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        description="This is a modal dialog component"
        size="md"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600">
            This modal demonstrates the modal component with a title, description, and custom content.
          </p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)} fullWidth>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
