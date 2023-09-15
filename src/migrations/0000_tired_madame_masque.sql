CREATE TABLE `channel` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'TEXT',
	`profile_id` integer,
	`server_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`server_id`) REFERENCES `server`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'GUEST',
	`profile_id` integer,
	`server_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`server_id`) REFERENCES `server`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`image_url` text,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `server` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`image_url` text,
	`invite_code` text NOT NULL,
	`profile_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `profile_channel_idx` ON `channel` (`profile_id`);--> statement-breakpoint
CREATE INDEX `server_channel_idx` ON `channel` (`server_id`);--> statement-breakpoint
CREATE INDEX `profile_member_idx` ON `member` (`profile_id`);--> statement-breakpoint
CREATE INDEX `server_member_idx` ON `member` (`server_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_user_id_unique` ON `profile` (`user_id`);--> statement-breakpoint
CREATE INDEX `profile_server_idx` ON `server` (`profile_id`);