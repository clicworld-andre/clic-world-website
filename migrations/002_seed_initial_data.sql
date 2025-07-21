-- Blog Management System Seed Data
-- Migration: 002_seed_initial_data.sql
-- Description: Populates tables with initial data based on existing blog posts
-- Date: 2025-07-20

-- =====================================================
-- INSERT AUTHORS
-- =====================================================

INSERT INTO authors (name, email, bio, active) VALUES 
('Andre van Zyl', 'andre@clic.world', 'CEO & Co-founder of Clic.World, visionary leader building the future of community-owned finance', true),
('ClicBrain AI', 'clicbrain@clic.world', 'Advanced AI-human partnership system powering innovation at Clic.World', true),
('Clic.World Team', 'team@clic.world', 'The collective intelligence of the Clic.World community and development team', true),
('Clic.World Technical Team', 'tech@clic.world', 'Technical experts specializing in blockchain, fintech, and financial innovation', true),
('Clic Community', 'community@clic.world', 'The global community of Clic.World users and contributors', true),
('Andre & ClicBrain', 'collaboration@clic.world', 'Collaborative partnership between Andre van Zyl and ClicBrain AI', true);

-- =====================================================
-- INSERT CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description, color, active) VALUES 
('Movement', 'movement', 'Articles about the Clic.World movement and vision for community-owned finance', '#10B981', true),
('AI & Blockchain', 'ai-blockchain', 'Technology insights covering artificial intelligence and blockchain innovation', '#3B82F6', true),
('Global Impact', 'global-impact', 'Stories of global reach, community impact, and transformational change', '#8B5CF6', true),
('Platform Overview', 'platform-overview', 'Platform features, capabilities, and technical architecture', '#F59E0B', true),
('Virtual Assets', 'virtual-assets', 'Digital assets, tokenization, and virtual asset management', '#06B6D4', true),
('ClicBrain', 'clicbrain', 'ClicBrain AI articles and collaborative intelligence insights', '#EF4444', true);

-- =====================================================
-- INSERT TAGS
-- =====================================================

INSERT INTO tags (name, slug, description, color) VALUES 
-- Technology Tags
('blockchain', 'blockchain', 'Blockchain technology and distributed ledger systems', '#3B82F6'),
('AI', 'ai', 'Artificial intelligence and machine learning', '#EF4444'),
('fintech', 'fintech', 'Financial technology and digital banking innovation', '#10B981'),
('tokenization', 'tokenization', 'Asset tokenization and digital representation', '#06B6D4'),
('Stellar blockchain', 'stellar-blockchain', 'Stellar network and blockchain technology', '#000000'),

-- Geographic & Community Tags
('Africa', 'africa', 'African markets, communities, and economic development', '#F59E0B'),
('DRC', 'drc', 'Democratic Republic of Congo initiatives and projects', '#8B5CF6'),
('Kenya', 'kenya', 'Kenya-based operations and community programs', '#10B981'),
('Uganda', 'uganda', 'Uganda market expansion and local partnerships', '#3B82F6'),
('global', 'global', 'Global reach and international expansion', '#6B7280'),
('diaspora', 'diaspora', 'African diaspora and international community connections', '#8B5CF6'),

-- Financial Innovation Tags
('community finance', 'community-finance', 'Community-owned banking and financial services', '#10B981'),
('social banking', 'social-banking', 'Social banking and cooperative finance', '#059669'),
('cooperatives', 'cooperatives', 'Cooperative societies and SACCO organizations', '#0D9488'),
('SACCOs', 'saccos', 'Savings and Credit Cooperative Organizations', '#0F766E'),
('mobile money 2.0', 'mobile-money-2', 'Next generation mobile money and digital payments', '#06B6D4'),
('t-value', 't-value', 'Tokenized electronic value and mobile money tokenization', '#0891B2'),
('e-value', 'e-value', 'Electronic value and digital money systems', '#0E7490'),
('CBDC', 'cbdc', 'Central Bank Digital Currencies', '#155E75'),
('financial inclusion', 'financial-inclusion', 'Financial accessibility and inclusion initiatives', '#10B981'),

-- Movement & Vision Tags
('third way', 'third-way', 'Alternative economic model beyond capitalism and socialism', '#8B5CF6'),
('movement', 'movement', 'Social and economic movement for change', '#7C3AED'),
('vision', 'vision', 'Vision and mission of community-owned finance', '#6D28D9'),
('economic justice', 'economic-justice', 'Economic equality and justice initiatives', '#5B21B6'),
('sound money', 'sound-money', 'Stable currency and monetary systems', '#F59E0B'),
('restitution', 'restitution', 'Economic restitution and wealth redistribution', '#DC2626'),
('community', 'community', 'Community building and social connection', '#059669'),
('recentralization', 'recentralization', 'Recentralization of financial power to communities', '#7C2D12'),

-- Specialized Tags
('ClicBrain', 'clicbrain', 'ClicBrain AI system and collaborative intelligence', '#EF4444'),
('enterprise intelligence', 'enterprise-intelligence', 'Enterprise AI and knowledge management', '#DC2626'),
('AI-native', 'ai-native', 'AI-native systems and architecture', '#B91C1C'),
('knowledge management', 'knowledge-management', 'Knowledge management and organizational intelligence', '#991B1B'),
('symbiotic AI', 'symbiotic-ai', 'Symbiotic AI-human relationships', '#7F1D1D'),
('organizational consciousness', 'organizational-consciousness', 'Organizational consciousness and collective intelligence', '#6B1717'),
('living knowledge', 'living-knowledge', 'Living knowledge objects and dynamic information systems', '#5F1A13'),

-- Dialogue & Philosophy Tags
('symbiosis', 'symbiosis', 'Symbiotic relationships and mutual benefit', '#059669'),
('AI-human partnership', 'ai-human-partnership', 'Partnership between AI and human intelligence', '#DC2626'),
('extraction', 'extraction', 'Extractive economic models and exploitation', '#7F1D1D'),
('mango tree', 'mango-tree', 'Wisdom dialogues and deep conversations', '#10B981'),
('institutional control', 'institutional-control', 'Institutional control and power structures', '#374151'),
('Claude', 'claude', 'Conversations with Claude AI', '#6B7280'),
('wisdom', 'wisdom', 'Wisdom sharing and knowledge exchange', '#F59E0B'),

-- Impact & Development Tags
('demographics', 'demographics', 'Demographic trends and population analysis', '#8B5CF6'),
('youth', 'youth', 'Youth demographics and generational change', '#3B82F6'),
('digital natives', 'digital-natives', 'Digital native populations and technology adoption', '#06B6D4'),
('CLIX ecosystem', 'clix-ecosystem', 'CLIX social financial ecosystem', '#10B981'),
('future', 'future', 'Future trends and forward-looking analysis', '#6366F1'),
('artisanal mining', 'artisanal-mining', 'Artisanal mining and small-scale extraction', '#F59E0B'),
('Isiolo', 'isiolo', 'Isiolo region projects and development', '#059669'),
('SEED model', 'seed-model', 'Sustainable Economic and Environmental Development model', '#10B981'),

-- Concept & Innovation Tags
('dialogue', 'dialogue', 'Deep dialogue and meaningful conversation', '#6B7280'),
('reframing', 'reframing', 'Reframing perspectives and paradigm shifts', '#8B5CF6'),
('innovation', 'innovation', 'Innovation and breakthrough thinking', '#3B82F6'),
('partnership', 'partnership', 'Partnership and collaborative relationships', '#10B981'),
('revolution', 'revolution', 'Revolutionary change and transformation', '#DC2626'),
('economics', 'economics', 'Economic theory and practice', '#F59E0B');

-- =====================================================
-- MIGRATION TRACKING
-- =====================================================

-- Update schema migrations table
INSERT INTO schema_migrations (version, description, applied_at) 
VALUES ('002', 'Seed initial blog data', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO NOTHING;
