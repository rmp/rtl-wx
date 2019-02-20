#!/usr/bin/env perl
use strict;
use warnings;
use IO::Pipe;
use JSON;

my $DIR_CURRENT = q[/ram/];
my $FILE_CURRENT = qq[$DIR_CURRENT/wx.json];

my $pipe = IO::Pipe->new();
$pipe->reader("tail -1 $FILE_CURRENT");

my $last = <$pipe>;
chomp $last;
my $json   = JSON->new;
my $struct = $json->decode($last);
my $clean  = $json->encode($struct);

print "Content-type: application/json\n\n$clean";
