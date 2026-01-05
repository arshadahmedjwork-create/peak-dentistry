-- Create treatment categories table
CREATE TABLE public.treatment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create treatment procedures table
CREATE TABLE public.treatment_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.treatment_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  benefits TEXT,
  aftercare TEXT,
  procedure_details TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add procedure_id to treatments table
ALTER TABLE public.treatments ADD COLUMN procedure_id UUID REFERENCES public.treatment_procedures(id);

-- Enable RLS
ALTER TABLE public.treatment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_procedures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for treatment_categories
CREATE POLICY "Anyone can view treatment categories"
ON public.treatment_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage treatment categories"
ON public.treatment_categories FOR ALL
USING (is_admin(auth.uid()));

-- RLS Policies for treatment_procedures
CREATE POLICY "Anyone can view treatment procedures"
ON public.treatment_procedures FOR SELECT
USING (true);

CREATE POLICY "Admins can manage treatment procedures"
ON public.treatment_procedures FOR ALL
USING (is_admin(auth.uid()));

-- Seed treatment categories
INSERT INTO public.treatment_categories (name, description, display_order) VALUES
('Preventive & Diagnostic Dentistry', 'Regular check-ups and preventive care', 1),
('Restorative Dentistry', 'Repair and restore damaged teeth', 2),
('Cosmetic & Aesthetic Dentistry', 'Enhance the appearance of your smile', 3),
('Orthodontics (Braces & Aligners)', 'Straighten teeth and correct bite issues', 4),
('Prosthodontics (Tooth Replacement)', 'Replace missing teeth with natural-looking solutions', 5),
('Periodontics (Gum Treatments)', 'Treat gum disease and maintain gum health', 6),
('Oral Surgery', 'Surgical procedures for complex dental issues', 7),
('Pediatric Dentistry', 'Specialized care for children', 8),
('Digital & Advanced Dentistry', 'Cutting-edge technology for precise treatment', 9),
('Specialized Treatments', 'Advanced care for complex conditions', 10),
('Preventive Packages', 'Comprehensive care bundles', 11);

-- Seed treatment procedures
INSERT INTO public.treatment_procedures (category_id, name, description, benefits, aftercare, procedure_details, display_order)
SELECT 
  c.id,
  p.name,
  p.description,
  p.benefits,
  p.aftercare,
  p.procedure_details,
  p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Preventive & Diagnostic Dentistry
  ('Routine Dental Check-ups', 'Comprehensive oral evaluation every 6 months, including gum health, cavities, bite alignment, and overall hygiene assessment.', 'Early detection prevents costly treatments.', 'Maintain twice-daily brushing and flossing; follow recall visits.', NULL, 1),
  ('Dental Cleaning (Scaling & Polishing)', 'Ultrasonic cleaning removes plaque, tartar, and stains; polishing restores natural shine.', 'Fresher breath, improved gum health.', 'Avoid colored beverages for 24 hours; gentle brushing recommended.', NULL, 2),
  ('Digital X-Rays & Intraoral Scans', 'Low-radiation imaging for precision diagnostics.', 'Immediate visualization; essential for treatment planning.', NULL, NULL, 3),
  ('Fluoride Therapy', 'Professional fluoride varnish strengthens enamel, ideal for children and adults prone to decay.', 'Strengthens enamel and prevents cavities.', 'No eating or drinking for 30 minutes post-treatment.', NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Preventive & Diagnostic Dentistry'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Restorative Dentistry
  ('Dental Fillings (Composite Resin)', 'Tooth-colored restorations repair cavities or cracks while maintaining aesthetics.', 'Restores function and prevents decay progression.', NULL, 'Decay removal → bonding → resin sculpting → curing.', 1),
  ('Root Canal Therapy', 'Removes infected pulp, disinfects canals, and seals tooth to prevent reinfection.', 'Saves natural tooth, eliminates pain.', 'Avoid hard foods until final crown placement.', NULL, 2),
  ('Crowns & Bridges', 'Custom-made porcelain, zirconia, or metal-free prosthetics to restore damaged or missing teeth.', 'Longevity, aesthetics, bite stability.', 'Regular cleaning and flossing around crowns and bridges.', NULL, 3),
  ('Inlays & Onlays', 'Mid-sized restorations preserving more natural tooth structure than crowns.', 'Ideal for fractured cusps or moderate decay.', NULL, NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Restorative Dentistry'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Cosmetic & Aesthetic Dentistry
  ('Teeth Whitening', 'Professional bleaching for visibly brighter smiles.', 'Instant results, safe for enamel.', 'Avoid coffee, tea, and tobacco for 48 hours.', NULL, 1),
  ('Veneers', 'Thin, custom shells placed on front teeth to correct discoloration, gaps, or misalignment.', 'Instant smile transformation, long-lasting.', NULL, NULL, 2),
  ('Smile Design & Digital Smile Simulation', 'AI-assisted digital preview of the final smile before treatment begins.', 'Predictable, patient-approved results.', NULL, NULL, 3),
  ('Gum Contouring (Laser Gingivoplasty)', 'Reshaping uneven gum lines for balanced aesthetics.', 'Improved smile aesthetics.', 'Soft diet for 24 hours.', NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Cosmetic & Aesthetic Dentistry'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Orthodontics
  ('Metal Braces', 'Traditional system for robust alignment correction.', 'High control for complex cases.', NULL, NULL, 1),
  ('Ceramic Braces', 'Tooth-colored brackets for discreet correction.', 'More aesthetic than metal braces.', NULL, NULL, 2),
  ('Self-Ligating Braces (Damon System)', 'Reduced friction, faster alignment, fewer visits.', 'More comfortable, efficient treatment.', NULL, NULL, 3),
  ('Clear Aligners (Digital Orthodontics)', 'Custom-fabricated transparent trays designed via digital scans — nearly invisible, removable, and comfortable.', 'Nearly invisible, removable for eating and cleaning.', 'Wear 20–22 hours/day; clean aligners with mild soap water.', NULL, 4),
  ('Retainers', 'Post-treatment appliances to maintain alignment.', 'Prevents teeth from shifting back.', NULL, NULL, 5)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Orthodontics (Braces & Aligners)'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Prosthodontics
  ('Complete Dentures', 'Full-arch replacement for edentulous patients; digitally fitted for comfort.', 'Restores full function and aesthetics.', 'Remove at night; clean with denture brush.', NULL, 1),
  ('Partial Dentures', 'Removable option to replace few missing teeth.', 'Cost-effective tooth replacement.', NULL, NULL, 2),
  ('Dental Implants', 'Titanium fixtures integrated into jawbone; topped with crowns for a permanent, natural-looking tooth.', 'Long-term solution, preserves bone.', 'Avoid smoking; maintain impeccable oral hygiene.', NULL, 3),
  ('All-on-4 / All-on-6 Implants', 'Full-arch fixed restorations supported by 4 or 6 implants — ideal for total mouth rehabilitation.', 'Immediate full-arch restoration with fewer implants.', NULL, NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Prosthodontics (Tooth Replacement)'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Periodontics
  ('Scaling & Root Planing', 'Removes plaque beneath the gumline; smoothens roots to promote healing.', 'Treats gum disease and prevents tooth loss.', NULL, NULL, 1),
  ('Laser Gum Therapy', 'Minimally invasive treatment for periodontal pockets and infections.', 'Less pain, faster healing than traditional surgery.', NULL, NULL, 2),
  ('Crown Lengthening', 'Reshapes gum and bone for proper crown fitting or aesthetic balance.', 'Improves smile aesthetics and crown fit.', NULL, NULL, 3),
  ('Gingival Grafting', 'Restores receding gums using soft-tissue grafts.', 'Protects tooth roots and improves aesthetics.', NULL, NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Periodontics (Gum Treatments)'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Oral Surgery
  ('Tooth Extractions', 'Removal of non-restorable or impacted teeth.', 'Prevents infection and pain.', 'Bite gauze for 30 minutes, avoid rinsing for 24 hours, cold compress if swelling.', NULL, 1),
  ('Wisdom Tooth Removal', 'Surgical extraction under local anesthesia.', 'Prevents complications from impacted wisdom teeth.', NULL, NULL, 2),
  ('Apicoectomy', 'Minor surgical procedure to remove infection at tooth root tip.', 'Saves tooth when root canal therapy fails.', NULL, NULL, 3),
  ('Cyst Removal / Biopsy', 'For diagnosis or management of oral lesions.', 'Early detection of oral pathology.', NULL, NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Oral Surgery'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Pediatric Dentistry
  ('Child Dental Check-ups', 'Gentle consultations to establish early oral habits.', 'Establishes good oral hygiene habits early.', NULL, NULL, 1),
  ('Fluoride & Fissure Sealants', 'Protective coatings that prevent cavity formation.', 'Significantly reduces cavity risk in children.', NULL, NULL, 2),
  ('Space Maintainers', 'Preserve alignment when baby teeth are lost prematurely.', 'Prevents orthodontic problems later.', NULL, NULL, 3),
  ('Pulpotomy / Pulpectomy', 'Child-specific root canal variants.', 'Saves primary teeth until natural shedding.', NULL, NULL, 4),
  ('Behavioral Dentistry', 'Anxiety-free methods — cartoons, positive reinforcement, nitrous oxide sedation if needed.', 'Reduces dental anxiety in children.', NULL, NULL, 5)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Pediatric Dentistry'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Digital & Advanced Dentistry
  ('Digital Orthodontics', 'AI-powered planning for clear aligners with predictive tooth-movement simulation.', 'Precise, predictable results with advanced technology.', NULL, NULL, 1),
  ('Intraoral 3D Scanning', 'Comfortable, precise digital impressions replacing messy molds.', 'More comfortable, accurate than traditional impressions.', NULL, NULL, 2),
  ('CBCT Imaging', '3D scans for surgical and implant planning.', 'Superior diagnostic precision for complex cases.', NULL, NULL, 3),
  ('CAD-CAM Crowns', 'Same-day ceramic restorations milled with high accuracy.', 'Get your crown in a single visit.', NULL, NULL, 4),
  ('Laser Dentistry', 'Used for cavity sterilization, gum reshaping, and soft-tissue healing with minimal discomfort.', 'Less pain, faster healing, minimal bleeding.', NULL, NULL, 5)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Digital & Advanced Dentistry'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Specialized Treatments
  ('TMJ Therapy', 'Treatment for jaw pain, clicking, and headaches caused by bite imbalance or stress.', 'Relieves chronic jaw pain and headaches.', NULL, NULL, 1),
  ('Night Guards / Bruxism Management', 'Custom-fit guards to protect teeth from grinding during sleep.', 'Prevents tooth damage from grinding.', NULL, NULL, 2),
  ('Full-Mouth Rehabilitation', 'Comprehensive plan combining restorative, cosmetic, and orthodontic care for functional and aesthetic renewal.', 'Complete restoration of oral health and aesthetics.', NULL, NULL, 3),
  ('Smile Makeover Packages', 'Tailored blend of whitening, veneers, aligners, and contouring for complete smile transformation.', 'Dramatic smile improvement with coordinated treatments.', NULL, NULL, 4)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Specialized Treatments'

UNION ALL

SELECT c.id, p.name, p.description, p.benefits, p.aftercare, p.procedure_details, p.display_order
FROM public.treatment_categories c
CROSS JOIN LATERAL (VALUES
  -- Preventive Packages
  ('Peak Care Basic', 'Check-up, cleaning, and fluoride therapy every 6 months.', 'Essential preventive care to maintain oral health.', NULL, NULL, 1),
  ('Peak Care Plus', 'Adds whitening or scaling depending on need.', 'Enhanced preventive care with cosmetic benefits.', NULL, NULL, 2),
  ('Peak Care Premium', 'Includes smile simulation, whitening, and consultation with lead orthodontist.', 'Comprehensive preventive and cosmetic package.', NULL, NULL, 3)
) AS p(name, description, benefits, aftercare, procedure_details, display_order)
WHERE c.name = 'Preventive Packages';

-- Create indexes for better query performance
CREATE INDEX idx_treatment_procedures_category_id ON public.treatment_procedures(category_id);
CREATE INDEX idx_treatments_procedure_id ON public.treatments(procedure_id);

-- Add trigger for updated_at
CREATE TRIGGER update_treatment_categories_updated_at
BEFORE UPDATE ON public.treatment_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_procedures_updated_at
BEFORE UPDATE ON public.treatment_procedures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();