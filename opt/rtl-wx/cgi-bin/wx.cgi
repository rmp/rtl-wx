#!/usr/bin/env perl
use strict;
use warnings;
use IO::Pipe;
use JSON;
use CGI;

my $DIR_CURRENT = q[/ram/];

my $cgi = CGI->new;

my $type = $cgi->param('type') || 'wx';

print "Content-type: application/json\n\n";

{
  forecast => \&forecast,
  wx => \&wx,
}->{$type}->();

sub wx {
  my $FILE_CURRENT = qq[$DIR_CURRENT/wx.json];

  my $pipe = IO::Pipe->new();
  $pipe->reader("tail -1 $FILE_CURRENT");
  
  my $last = <$pipe>;
  chomp $last;
  my $json   = JSON->new;
  my $struct = $json->decode($last);
  my $clean  = $json->encode($struct);
  
  print $clean;
}

sub forecast {
  my $FILE_CURRENT = qq[/data/5dayforecast.json];

  my $io = IO::File->new($FILE_CURRENT);
  while(<$io>) {
    print;
  }
  $io->close;
}
