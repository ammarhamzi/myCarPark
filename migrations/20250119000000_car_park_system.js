/**
 * Car Park Management System Migration
 * Phase 1 MVP - Core tables for parking, bookings, vehicles, shuttle, and car wash
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Parking spaces table
    .createTable('parking_spaces', function(table) {
      table.increments('id').primary();
      table.string('space_number', 10).notNullable().unique();
      table.enum('type', ['open_air', 'covered']).notNullable();
      table.enum('status', ['available', 'occupied', 'maintenance', 'reserved']).defaultTo('available');
      table.decimal('hourly_rate', 8, 2).notNullable();
      table.decimal('daily_rate', 8, 2).notNullable();
      table.boolean('is_active').defaultTo(true);
      table.text('notes');
      table.timestamps(true, true);
      
      table.index(['type', 'status']);
      table.index(['status']);
    })
    
    // Car park configuration table
    .createTable('park_config', function(table) {
      table.increments('id').primary();
      table.string('key', 100).notNullable().unique();
      table.text('value').notNullable();
      table.string('type', 50).defaultTo('string'); // string, number, boolean, json
      table.text('description');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    
    // Vehicles table
    .createTable('vehicles', function(table) {
      table.increments('id').primary();
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('plate_number', 20).notNullable();
      table.enum('car_type', ['sedan', 'suv', 'mpv', 'hatchback', 'coupe']).notNullable();
      table.string('make', 50);
      table.string('model', 50);
      table.string('color', 30);
      table.boolean('is_default').defaultTo(false);
      table.timestamps(true, true);
      
      table.unique(['customer_id', 'plate_number']);
      table.index(['customer_id']);
      table.index(['plate_number']);
    })
    
    // Bookings table
    .createTable('bookings', function(table) {
      table.increments('id').primary();
      table.string('booking_reference', 20).notNullable().unique();
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('space_id').unsigned().references('id').inTable('parking_spaces').onDelete('SET NULL');
      table.integer('vehicle_id').unsigned().notNullable().references('id').inTable('vehicles').onDelete('CASCADE');
      
      // Booking details
      table.datetime('scheduled_check_in').notNullable();
      table.datetime('scheduled_check_out').notNullable();
      table.datetime('actual_check_in');
      table.datetime('actual_check_out');
      table.enum('parking_type', ['open_air', 'covered']).notNullable();
      
      // Pricing
      table.decimal('base_amount', 10, 2).notNullable();
      table.decimal('service_amount', 10, 2).defaultTo(0);
      table.decimal('total_amount', 10, 2).notNullable();
      table.string('currency', 3).defaultTo('MYR');
      
      // Status and services
      table.enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']).defaultTo('pending');
      table.boolean('shuttle_required').defaultTo(false);
      table.enum('shuttle_terminal', ['T1', 'T2']);
      table.boolean('car_wash_requested').defaultTo(false);
      
      // Additional info
      table.text('special_instructions');
      table.text('admin_notes');
      table.timestamps(true, true);
      
      table.index(['customer_id']);
      table.index(['status']);
      table.index(['scheduled_check_in']);
      table.index(['scheduled_check_out']);
      table.index(['booking_reference']);
    })
    
    // Shuttle schedules table
    .createTable('shuttle_schedules', function(table) {
      table.increments('id').primary();
      table.time('departure_time').notNullable();
      table.enum('terminal', ['T1', 'T2']).notNullable();
      table.integer('capacity').defaultTo(12);
      table.integer('driver_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.boolean('is_active').defaultTo(true);
      table.enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
      table.text('notes');
      table.timestamps(true, true);
      
      table.index(['terminal', 'is_active']);
      table.index(['departure_time']);
    })
    
    // Shuttle trips table (for tracking actual trips)
    .createTable('shuttle_trips', function(table) {
      table.increments('id').primary();
      table.integer('schedule_id').unsigned().notNullable().references('id').inTable('shuttle_schedules').onDelete('CASCADE');
      table.date('trip_date').notNullable();
      table.time('actual_departure');
      table.time('actual_arrival');
      table.integer('passenger_count').defaultTo(0);
      table.enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled']).defaultTo('scheduled');
      table.text('trip_notes');
      table.timestamps(true, true);
      
      table.unique(['schedule_id', 'trip_date']);
      table.index(['trip_date']);
    })
    
    // Car wash orders table
    .createTable('car_wash_orders', function(table) {
      table.increments('id').primary();
      table.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
      table.enum('car_type', ['sedan', 'suv', 'mpv', 'hatchback', 'coupe']).notNullable();
      table.decimal('price', 8, 2).notNullable();
      table.enum('wash_type', ['basic', 'premium', 'deluxe']).defaultTo('basic');
      table.enum('status', ['pending', 'in_progress', 'completed', 'cancelled']).defaultTo('pending');
      table.integer('assigned_staff_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.datetime('started_at');
      table.datetime('completed_at');
      table.text('instructions');
      table.text('completion_notes');
      table.timestamps(true, true);
      
      table.index(['booking_id']);
      table.index(['status']);
      table.index(['assigned_staff_id']);
    })
    
    // Payments table
    .createTable('payments', function(table) {
      table.increments('id').primary();
      table.integer('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
      table.string('payment_reference', 100);
      table.string('payment_method', 50); // fpx, credit_card, ewallet
      table.string('payment_provider', 50); // stripe, billplz, ipay88
      table.decimal('amount', 10, 2).notNullable();
      table.string('currency', 3).defaultTo('MYR');
      table.enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded']).defaultTo('pending');
      table.string('provider_transaction_id', 100);
      table.json('provider_response');
      table.datetime('paid_at');
      table.text('failure_reason');
      table.timestamps(true, true);
      
      table.index(['booking_id']);
      table.index(['status']);
      table.index(['payment_reference']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payments')
    .dropTableIfExists('car_wash_orders')
    .dropTableIfExists('shuttle_trips')
    .dropTableIfExists('shuttle_schedules')
    .dropTableIfExists('bookings')
    .dropTableIfExists('vehicles')
    .dropTableIfExists('park_config')
    .dropTableIfExists('parking_spaces');
}; 